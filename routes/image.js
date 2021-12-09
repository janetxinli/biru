const multer = require("multer");
const router = require("express").Router();
const globalConfig = require("../globalConfig.json");
const imageController = require("../controllers/image");

// images will be base64-encoded
// base64 makes images approximately 33% larger
const upload = multer({
  limits: { fieldSize: (4 / 3) * globalConfig.MAX_IMAGE_SIZE },
});

router.post("/upload", upload.none("image"), imageController.upload);

module.exports = router;
