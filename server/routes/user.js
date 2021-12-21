const router = require("express").Router();
const userController = require("../controllers/user");
const { requireLogin } = require("../utils/middleware");

router.get("/", requireLogin, userController.getAll);

router.post("/", userController.createUser);

router.get("/search", requireLogin, userController.searchUsers);

router.get("/:username", requireLogin, userController.getUser);

router.get("/:username/profile", requireLogin, userController.getProfile);

module.exports = router;
