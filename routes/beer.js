const router = require("express").Router();
const error = require("../utils/error");
const { Beer } = require("../models");

router.get("/", async (req, res, next) => {
  const { beerType, sort, descending } = req.query;

  // define query object
  const queryObj = {};

  // filter by beerType
  if (beerType) {
    queryObj["where"] = { beerType };
  }

  // sort result
  // sort by date by default
  const sortBy = sort || "name";
  const order = [];

  if (sortBy === "date" || sortBy === "name" || sortBy === "rating") {
    order.push(sortBy);
  } else {
    const err = error(400, "Invalid ordering parameter");
    next(err);
  }

  if (descending) order.push("DESC");
  queryObj["order"] = [order];

  try {
    const beers = await Beer.findAll(queryObj);
    return res.json({ payload: beers });
  } catch (e) {
    const err = error(500, e.message);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const beer = await Beer.findOne({ where: { id } });
    if (!beer) {
      const err = error(404, "Beer does not exist");
      next(err);
    }
    return res.json({ payload: beer });
  } catch (e) {
    const err = error(500, "Server error");
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const { name, brewer, rating, servingType, beerType, abv, ibu, date, notes } =
    req.body;
  // check that name, brewer and rating exist
  if (!name || !brewer || !rating)
    return res
      .status(400)
      .send({ message: "'name', 'brewer' and 'rating' are required" });

  try {
    const newBeer = await Beer.create({
      name,
      brewer,
      rating,
      servingType,
      beerType,
      abv: abv ? parseFloat(abv) : null,
      ibu: ibu ? parseInt(ibu) : null,
      date,
      notes,
    });
    return res.status(201).json({ payload: newBeer });
  } catch (e) {
    const err = error(500, "Unable to create beer");
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, brewer, rating, servingType, beerType, abv, ibu, date, notes } =
    req.body;

  try {
    const updatedBeer = await Beer.update(
      {
        name,
        brewer,
        rating,
        servingType,
        beerType,
        abv: abv ? parseFloat(abv) : null,
        ibu: ibu ? parseInt(ibu) : null,
        date,
        notes,
      },
      { where: { id }, returning: true }
    );

    return res.status(201).json({ payload: updatedBeer[1][0] });
  } catch (e) {
    const err = error(500, "Unable to update beer");
    next(err);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const beer = await Beer.findOne({ where: { id } });
    if (!beer) {
      const err = error(404, "Beer does not exist");
    }
    await beer.destroy();
    return res.status(204).end();
  } catch (e) {
    const err = error(500, "Server error");
    next(err);
  }
});

module.exports = router;
