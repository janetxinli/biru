const router = require("express").Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const beers = await pool.query("SELECT * FROM beers;");
    return res.json({ payload: beers.rows });
  } catch (err) {
    const error = error(500, err.message);
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
    date_added,
    notes,
  } = req.body;
  // check that name, brewer and rating exist
  if (!name || !brewer || !rating)
    return res
      .status(400)
      .send({ message: "'name', 'brewer' and 'rating' are required" });

  try {
    const newBeer = await pool.query(
      "INSERT INTO beers (name, brewer, rating, serving_type, beer_type, abv, ibu, date_added, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        name,
        brewer,
        rating,
        serving_type,
        beer_type,
        abv,
        ibu,
        date_added,
        notes,
      ]
    );
    return res.status(201).json({ payload: newBeer.rows[0] });
  } catch (err) {
    console.log(err);
    return res.status(500);
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: true });
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
    date_added,
    notes,
  } = req.body;

  try {
    const updatedBeer = await pool.query(
      "UPDATE beers SET name = $1, brewer = $2, rating = $3, serving_type = $4, beer_type = $5, abv = $6, ibu = $7, date_added = $8, notes = $9 where id = $10 RETURNING *",
      [
        name,
        brewer,
        rating,
        serving_type,
        beer_type,
        abv,
        ibu,
        date_added,
        notes,
        id,
      ]
    );
    return res.status(201).json({ payload: updatedBeer.rows[0] });
  } catch (err) {
    const error = error(500, err.message);
    next(error);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM beers WHERE ID = $1", [id]);
    return res.status(204).end();
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

module.exports = router;
