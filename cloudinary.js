const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./utils/config");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
};

module.exports = { cloudinary, uploadToCloudinary };
