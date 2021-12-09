const { StatusCodes } = require("http-status-codes");
const passport = require("../passport");
const error = require("./error");

const passportHandler = (req, next) => {
  const handler = (err, user, info) => {
    if (err) {
      return next(err);
    }

    req.user = user;
    return next();
  };

  return handler;
};

const authenticateLogin = (req, res, next) => {
  passport.authenticate("login", passportHandler(req, next))(req, res, next);
};

const requireLogin = (req, res, next) => {
  if (!req.session.passport?.user) {
    const e = error(StatusCodes.UNAUTHORIZED, "Not authorized");
    return next(e);
  }

  return next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
};

module.exports = {
  authenticateLogin,
  requireLogin,
  errorHandler,
};
