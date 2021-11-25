const passport = require("../passport");

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
  passport.authenticate(
    "login",
    { session: false },
    passportHandler(req, next)
  )(req, res, next);
};

const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, passportHandler(req, next))(
    req,
    res,
    next
  );
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
};

module.exports = {
  authenticateLogin,
  authenticateJwt,
  errorHandler,
};
