const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const beerRouter = require("./routes/beer");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const middleware = require("./utils/middleware");
const passport = require("./passport");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/beer", beerRouter);
app.use("/api/auth", authRouter);

// require authenticated users
app.use("/api/user", passport.authenticate("jwt", { session: false }), userRouter);

app.use(middleware.errorHandler);

module.exports = app;
