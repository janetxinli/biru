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
      bio: bio || null,
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
  const { username, id } = req.user;

  return res.status(StatusCodes.OK).json({ user: { username, id } });
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

const check = async (req, res, next) => {
  const { user } = req;

  const response = { authenticated: user !== undefined };

  if (user) {
    response.user = {
      username: user.username,
      id: user.id,
    };
  }
  return res.status(StatusCodes.OK).json(response);
};

module.exports = {
  signup,
  login,
  logout,
  check,
};
