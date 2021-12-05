// create new image
const createImage = async (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (e) => reject(e));
    image.src = url;
  });
};

const getRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

const getBoundingBoxSize = (width, height, radians) => {
  const c = Math.abs(Math.cos(radians));
  const s = Math.abs(Math.sin(radians));

  const newWidth = height * s + width * c;
  const newHeight = height * c + width * s;

  return [newWidth, newHeight];
};

export const cropImage = async (url, fileType, pixelCrop, rotation = 0) => {
  const image = await createImage(url);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const { width: cropWidth, height: cropHeight, x, y } = pixelCrop;

  const rotationRads = getRadians(rotation);

  // calculate bounding box
  const [newWidth, newHeight] = getBoundingBoxSize(
    image.width,
    image.height,
    rotationRads
  );

  // set and translate canvas context
  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(rotationRads);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw image
  ctx.drawImage(image, 0, 0);

  // extract the cropped image
  const cropped = ctx.getImageData(x, y, cropWidth, cropHeight);

  // set size to desired crop size
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  // place rotated image
  ctx.putImageData(cropped, 0, 0);

  return canvas.toDataURL(fileType);
};
