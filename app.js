const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const beerRouter = require("./routes/beer");
const middleware = require("./utils/middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/beer", beerRouter);

app.use(middleware.errorHandler);

module.exports = app;
