const { uploadToCloudinary } = require("../cloudinary");
const error = require("../utils/error");
const globalConfig = require("../globalConfig.json");
const multer = require("multer");
const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");

// images will be base64-encoded
// base64 makes images approximately 33% larger
const upload = multer({
  limits: { fieldSize: (4 / 3) * globalConfig.maxImageSize },
});

router.post("/upload", upload.none("image"), async (req, res, next) => {
  const { image } = req.body;

  // check for image in request body
  if (!image) {
    const err = error(StatusCodes.BAD_REQUEST, "Image is required");
    return next(err);
  }

  try {
    const upload = await uploadToCloudinary(image);
    return res
      .status(StatusCodes.CREATED)
      .json({ payload: { url: upload.secure_url } });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
