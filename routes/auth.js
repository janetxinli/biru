const router = require("express").Router();
const passport = require("../passport");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { JWT_SECRET } = require("../utils/config");
const error = require("../utils/error");
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
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
});

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res, next) => {
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
  }
);

router.get("/logout", async (req, res, next) => {
  try {
    return res
      .clearCookie("biruCookie")
      .status(StatusCodes.OK)
      .json({ message: "Logged out successfully " })
      .send();
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to log out");
    return next(err);
  }
});

module.exports = router;
