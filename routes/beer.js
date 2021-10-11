const router = require("express").Router();
const error = require("../utils/error");
const pool = require("../db");

// TODO: use morgan for logging

router.get("/", async (req, res, next) => {
  const { beer_type, sort, descending } = req.query;

  // filter by beer type
  let beerTypeString = "";
  let params = null;
  if (beer_type) {
    beerTypeString = "WHERE beer_type = $1 ";
    params = [beer_type];
  }

  // sort result
  // sort by date by default
  const sortBy = sort || "name";
  const order = descending ? "DESC" : "";
  let sortString;
  if (sortBy === "date" || sortBy === "name" || sortBy === "rating") {
    sortString = `${sortBy} ${order}`;
  } else {
    const err = error(400, "Invalid query parameter for sort");
    next(err);
  }

  try {
    const beers = await pool.query(
      `SELECT * FROM beers ${beerTypeString} ORDER BY ${sortString}`,
      params
    );
    return res.json({ payload: beers.rows });
  } catch (e) {
    const err = error(500, e.message);
    next(err);
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    brewer,
    rating,
    serving_type,
    beer_type,
    abv,
    ibu,
    date,
    notes,
  } = req.body;
  // check that name, brewer and rating exist
  if (!name || !brewer || !rating)
    return res
      .status(400)
      .send({ message: "'name', 'brewer' and 'rating' are required" });

  try {
    const newBeer = await pool.query(
      "INSERT INTO beers (name, brewer, rating, serving_type, beer_type, abv, ibu, date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        name,
        brewer,
        rating,
        serving_type,
        beer_type,
        abv,
        ibu,
        date,
        notes,
      ]
    );
    return res.status(201).json({ payload: newBeer.rows[0] });
  } catch (e) {
    const err = error(500, "Unable to create beer");
    next(err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const beer = await pool.query("SELECT * FROM beers WHERE id = $1", [id]);
    if (beer.rows.length) {
      return res.json({ payload: beer.rows[0] });
    }
    return res.status(400).json({ error: true });
  } catch (e) {
    const err = error(500, "Server error");
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    brewer,
    rating,
    serving_type,
    beer_type,
    abv,
    ibu,
    date,
    notes,
  } = req.body;

  try {
    const updatedBeer = await pool.query(
      "UPDATE beers SET name = $1, brewer = $2, rating = $3, serving_type = $4, beer_type = $5, abv = $6, ibu = $7, date = $8, notes = $9 where id = $10 RETURNING *",
      [
        name,
        brewer,
        rating,
        serving_type,
        beer_type,
        abv,
        ibu,
        date,
        notes,
        id,
      ]
    );
    return res.status(201).json({ payload: updatedBeer.rows[0] });
  } catch (e) {
    const err = error(500, "Unable to update beer");
    next(err);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM beers WHERE ID = $1", [id]);
    return res.status(204).end();
  } catch (e) {
    const err = error(500, "Server error");
    next(err);
  }
});

module.exports = router;
