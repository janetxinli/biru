const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const beerRouter = require("./routes/beer");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const middleware = require("./utils/middleware");
const passport = require("./passport");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/auth", authRouter);

// require authenticated users for access
app.use(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  userRouter
);
app.use(
  "/api/beer",
  passport.authenticate("jwt", { session: false }),
  beerRouter
);

app.use(middleware.errorHandler);

module.exports = app;
