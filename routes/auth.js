const authController = require("../controllers/auth");
const { authenticateLogin } = require("../utils/middleware");

const router = require("express").Router();

router.post("/signup", authController.signup);

router.post("/login", authenticateLogin, authController.login);

router.get("/logout", authController.logout);

module.exports = router;
