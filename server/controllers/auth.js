const { StatusCodes } = require("http-status-codes");
const { SESSION_NAME } = require("../utils/config");

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
  login,
  logout,
  check,
};
