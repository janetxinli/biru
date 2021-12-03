const { uploadToCloudinary } = require("../cloudinary");
const error = require("../utils/error");
const multer = require("multer");
const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");

const upload = multer({
  limits: { fieldSize: 10 * (4 / 3) * Math.pow(10, 6) },
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
