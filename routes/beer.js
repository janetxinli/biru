const router = require("express").Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const beers = await pool.query("SELECT * FROM beers;");
    return res.json({ payload: beers.rows });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

// TODO: add 'type' field (IPA, stout, etc.), notes
// TODO: add error handling middleware
// TODO: add GET and PUT methods for individual beers

router.post("/", async (req, res) => {
  const { name, brewer, rating, servingType, abv, ibu } = req.body;
  // check that name, brewer and rating exist
  if (!name || !brewer || !rating)
    return res
      .status(400)
      .send({ message: "'name', 'brewer' and 'rating' are required" });

  try {
    const newBeer = await pool.query(
      "INSERT INTO beers (name, brewer, rating, serving_type, abv, ibu) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, brewer, rating, servingType, abv, ibu]
    );
    return res.status(201).json({ payload: newBeer.rows[0] });
  } catch (err) {
    console.log(err);
    return res.status(500);
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
