const passport = require("passport");
const { StatusCodes } = require("http-status-codes");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const cookieExtractor = require("./utils/cookieExtractor");
const error = require("./utils/error");
const { JWT_SECRET } = require("./utils/config");
const { User } = require("./models");

passport.use(
  "login",
  new localStrategy(
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

        return done(null, user[0]);
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        // search for a user with given credentials
        const user = await User.findByPk(jwtPayload);

        if (!user) {
          const err = error(StatusCodes.UNAUTHORIZED, "Invalid credentials");
          return done(err, false);
        }

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

module.exports = passport;
