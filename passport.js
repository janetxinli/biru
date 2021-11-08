const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
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
          return done(null, false, { message: "User not found" });
        }

        const validate = await user[0].validatePassword(password);

        // passwords do not match
        if (!validate) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, user[0]);
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      try {
        // search for a user with given credentials
        const user = await User.findByPk(jwtPayload);

        if (!user) {
          return done(null, false, { message: "Invalid token credentials" });
        }

        return done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

module.exports = passport;
