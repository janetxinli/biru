const router = require("express").Router();
const authController = require("../controllers/auth");
const { authenticateLogin } = require("../utils/middleware");

router.post("/signup", authController.signup);

router.post("/login", authenticateLogin, authController.login);

router.get("/logout", authController.logout);

router.get("/check", authController.check);

module.exports = router;
