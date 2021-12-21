const router = require("express").Router();
const userController = require("../controllers/user");

router.get("/", userController.getAll);

router.get("/search", userController.searchUsers);

router.get("/:username", userController.getUser);

router.get("/:username/profile", userController.getProfile);

module.exports = router;
