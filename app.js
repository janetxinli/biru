const express = require("express");
const beerRouter = require("./routes/beer");
const db = require("./db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/beer", beerRouter);

module.exports = app;
