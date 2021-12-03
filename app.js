const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const beerRouter = require("./routes/beer");
const imageRouter = require("./routes/image");
const userRouter = require("./routes/user");
const { authenticateJwt, errorHandler } = require("./utils/middleware");
const passport = require("./passport");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
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
app.use("/api/user", authenticateJwt, userRouter);
app.use("/api/beer", authenticateJwt, beerRouter);
app.use("/api/image", authenticateJwt, imageRouter);

app.use(errorHandler);

module.exports = app;
