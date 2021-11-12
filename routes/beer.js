const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
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
    const err = error(StatusCodes.BAD_REQUEST, "Invalid ordering parameter");
    return next(err);
  }

  if (descending) order.push("DESC");
  queryObj["order"] = [order];

  try {
    const beers = await Beer.findAll(queryObj);
    return res.json({ payload: beers });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const beer = await Beer.findByPk(id);

    // beer with specified id not found
    if (!beer) {
      const err = error(StatusCodes.NOT_FOUND, "Beer does not exist");
      return next(err);
    }

    return res.json({ payload: beer });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, "Server error");
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  const { name, brewer, rating, servingType, beerType, abv, ibu, date, notes } =
    req.body;

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
      userId: req.user.id,
    });
    return res.status(StatusCodes.CREATED).json({ payload: newBeer });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, brewer, rating, servingType, beerType, abv, ibu, date, notes } =
    req.body;

  try {
    const beer = await Beer.findByPk(id);

    // beer does not belong to authorized user
    if (beer.userId !== req.user.id) {
      const err = error(StatusCodes.UNAUTHORIZED, "Unauthorized to edit beer");
      return next(err);
    }
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
        userId: req.user.id,
      },
      { where: { id }, returning: true }
    );

    return res.status(StatusCodes.OK).json({ payload: updatedBeer[1][0] });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const beer = await Beer.findByPk(id);

    // beer with specified id not found
    if (!beer) {
      const err = error(StatusCodes.NOT_FOUND, "Beer does not exist");
      return next(err);
    }

    // beer does not belong to authorized user
    if (beer.userId !== req.user.id) {
      const err = error(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized to delete beer"
      );
      return next(err);
    }

    await beer.destroy();
    return res.status(StatusCodes.NO_CONTENT).end();
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
});

module.exports = router;
