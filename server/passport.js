const passport = require("passport");
const { StatusCodes } = require("http-status-codes");
const LocalStrategy = require("passport-local").Strategy;
const error = require("./utils/error");
const { User } = require("./models");

passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.unscoped().findAll({
          where: {
            username,
          },
        });

        // no user with given username
        if (!user.length) {
          const err = error(StatusCodes.NOT_FOUND, "User not found");
          return done(err, false);
        }

        const validate = await user[0].validatePassword(password);

        // passwords do not match
        if (!validate) {
          const err = error(StatusCodes.UNAUTHORIZED, "Wrong password");
          return done(err, false);
        }

        req.logIn(user[0], (err) => {
          if (err) return done(err);
          return done(null, user[0]);
        });
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.unscoped().findByPk(id);
  if (!user) {
    const err = error(StatusCodes.NOT_FOUND, "User not found");
    return done(err, false);
  }

  return done(null, user);
});

passport.session();

module.exports = passport;
