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
    origin: IN_PROD ? "https://biru.vercel.app" : "http://localhost:3000",
  })
);

if (IN_PROD) app.enable("trust proxy");

app.use(
  session({
    store,
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    cookie: {
      secure: IN_PROD,
      maxAge: SESSION_COOKIE_MAX_AGE,
      sameSite: IN_PROD ? "none" : "lax",
    },
  })
);

store.sync();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

// require authenticated users for access
app.use("/api/beer", requireLogin, beerRouter);
app.use("/api/image", requireLogin, imageRouter);

app.use(errorHandler);

module.exports = app;
