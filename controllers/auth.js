const { StatusCodes } = require("http-status-codes");
const error = require("../utils/error");
const { SESSION_NAME } = require("../utils/config");
const { User } = require("../models");

const signup = async (req, res, next) => {
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
};

const login = async (req, res, next) => {
  return res.status(StatusCodes.OK).json({ message: "Logged in successfully" });
};

const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    return res
      .clearCookie(SESSION_NAME)
      .status(StatusCodes.OK)
      .json({ message: "Logged out successfully" });
  });
};

module.exports = {
  signup,
  login,
  logout,
};
