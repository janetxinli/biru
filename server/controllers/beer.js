const { StatusCodes } = require("http-status-codes");
const { Beer } = require("../models");
const error = require("../utils/error");

const getBeer = async (req, res, next) => {
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
};

const createBeer = async (req, res, next) => {
  const {
    name,
    brewer,
    rating,
    servingType,
    beerType,
    abv,
    ibu,
    date,
    notes,
    imageUrl,
  } = req.body;

  try {
    const newBeer = await Beer.create({
      name,
      brewer,
      rating,
      servingType: servingType || null,
      beerType: beerType || null,
      abv: abv ? parseFloat(abv) : null,
      ibu: ibu ? parseInt(ibu) : null,
      date,
      notes: notes || null,
      userId: req.user.id,
      imageUrl: imageUrl || null,
    });
    return res.status(StatusCodes.CREATED).json({ payload: newBeer });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
};

const updateBeer = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    brewer,
    rating,
    servingType,
    beerType,
    abv,
    ibu,
    date,
    notes,
    imageUrl,
  } = req.body;

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
        servingType: servingType || null,
        beerType: beerType || null,
        abv: abv ? parseFloat(abv) : null,
        ibu: ibu ? parseInt(ibu) : null,
        date,
        notes: notes || null,
        userId: req.user.id,
        imageUrl: imageUrl || null,
      },
      { where: { id }, returning: true }
    );

    return res.status(StatusCodes.OK).json({ payload: updatedBeer[1][0] });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
};

const deleteBeer = async (req, res, next) => {
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
};

module.exports = {
  getBeer,
  createBeer,
  updateBeer,
  deleteBeer,
};
