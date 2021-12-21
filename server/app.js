const cors = require("cors");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const {
  IN_PROD,
  SESSION_NAME,
  SESSION_SECRET,
  SESSION_COOKIE_MAX_AGE,
} = require("./utils/config");
const { sequelize } = require("./models");
const authRouter = require("./routes/auth");
const beerRouter = require("./routes/beer");
const imageRouter = require("./routes/image");
const userRouter = require("./routes/user");
const { requireLogin, errorHandler } = require("./utils/middleware");
const passport = require("./passport");

const app = express();
const store = new SequelizeStore({ db: sequelize });

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(
  session({
    store,
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: IN_PROD,
      maxAge: SESSION_COOKIE_MAX_AGE,
    },
  })
);

store.sync();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

// require authenticated users for access
app.use("/api/beer", requireLogin, beerRouter);
app.use("/api/image", requireLogin, imageRouter);

app.use(errorHandler);

module.exports = app;
