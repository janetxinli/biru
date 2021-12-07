const multer = require("multer");
const { StatusCodes } = require("http-status-codes");
const globalConfig = require("../globalConfig.json");
const imageController = require("../controllers/image");
const router = require("express").Router();

// images will be base64-encoded
// base64 makes images approximately 33% larger
const upload = multer({
  limits: { fieldSize: (4 / 3) * globalConfig.MAX_IMAGE_SIZE },
});

router.post("/upload", upload.none("image"), imageController.upload);

module.exports = router;
