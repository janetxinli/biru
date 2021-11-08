const router = require("express").Router();
const passport = require("../passport");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { JWT_SECRET } = require("../utils/config");
const error = require("../utils/error");
const { User } = require("../models");

// TODO: improve error handling

router.post("/signup", async (req, res, next) => {
  const { username, password, name, bio } = req.body;
  try {
    const newUser = await User.create({
      username,
      password,
      name,
      bio,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    next(err);
  }
});

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res, next) => {
    const { user } = req;
    try {
      const token = jwt.sign(user.id, JWT_SECRET);
      return res.status(StatusCodes.OK).json({ payload: { token } });
    } catch (e) {
      console.log(e);
      const err = error(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to log in");
      next(err);
    }
  }
);

module.exports = router;
