const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { authenticateLogin } = require("../utils/middleware");
const error = require("../utils/error");
const { JWT_SECRET } = require("../utils/config");
const { User } = require("../models");

router.post("/signup", async (req, res, next) => {
  const { username, password, name, bio } = req.body;

  try {
    await User.create({
      username,
      password,
      name,
      bio,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (e) {
    if (e.errors[0].message === "Username taken") {
      const err = error(StatusCodes.CONFLICT, e.message);
      return next(err);
    }
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
});

router.post("/login", authenticateLogin, async (req, res, next) => {
  const { user } = req;

  try {
    const token = jwt.sign(user.id, JWT_SECRET);

    return res
      .cookie("biruCookie", token, {
        httpOnly: true,
        secure: true, // TODO: make expire
        sameSite: "none",
      })
      .status(StatusCodes.OK)
      .json({ message: "Logged in successfully" });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to log in");
    return next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    return res
      .clearCookie("biruCookie")
      .status(StatusCodes.OK)
      .json({ message: "Logged out successfully " });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to log out");
    return next(err);
  }
});

module.exports = router;
