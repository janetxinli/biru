const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const error = require("../utils/error");
const { User, Beer } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    return res.status(StatusCodes.OK).json({ payload: allUsers });
  } catch (e) {
    const err = error(500, "Cannot get all users");
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);

    if (!user) {
      // No user is found
      const err = error(StatusCodes.NOT_FOUND, "User not found");
      return next(err);
    }

    return res.status(StatusCodes.OK).json({ payload: user });
  } catch (e) {
    const err = error(500, "Cannot get user");
    return next(err);
  }
});

router.get("/:id/beer", async (req, res, next) => {
  const { id } = req.params;
  try {
    const beers = await User.findAll({
      include: Beer,
      where: {
        id,
      },
    });

    return res.status(StatusCodes.OK).json({ payload: beers[0] });
  } catch (e) {
    const err = error(500, "Unable to get beer list");
    return next(err);
  }
});

module.exports = router;
