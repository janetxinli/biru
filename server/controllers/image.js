const { StatusCodes } = require("http-status-codes");
const error = require("../utils/error");
const { uploadToCloudinary } = require("../server/cloudinary");

const upload = async (req, res, next) => {
  const { image } = req.body;

  // check for image in request body
  if (!image) {
    const err = error(StatusCodes.BAD_REQUEST, "Image is required");
    return next(err);
  }

  try {
    const result = await uploadToCloudinary(image);
    return res
      .status(StatusCodes.CREATED)
      .json({ payload: { url: result.secure_url } });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  upload,
};
