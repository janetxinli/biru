const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const passport = require("../passport");
const error = require("../utils/error");
const { User, Beer } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    res.status(StatusCodes.OK).json({ payload: allUsers });
  } catch (e) {
    const err = error(500, "Cannot get all users");
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);

    if (!user) {
      // No user is found
      const err = error(404, "User not found");
      next(err);
    } else {
      res.status(StatusCodes.OK).json({ payload: user });
    }
  } catch (e) {
    const err = error(500, "Cannot get user");
    next(err);
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
    res.status(StatusCodes.OK).json({ payload: beers });
  } catch (e) {
    console.log(e);
    const err = error(500, "Unable to get beer list");
    next(err);
  }
});

module.exports = router;
