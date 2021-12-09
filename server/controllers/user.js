const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const { Beer, User } = require("../models");
const error = require("../utils/error");

const getAll = async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    return res.status(StatusCodes.OK).json({ payload: allUsers });
  } catch (e) {
    const err = error(StatusCodes.BAD_REQUEST, "Cannot get users");
    return next(err);
  }
};

const getUser = async (req, res, next) => {
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
    const err = error(StatusCodes.BAD_REQUEST, "Cannot get user");
    return next(err);
  }
};

const getUsersBeers = async (req, res, next) => {
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
    const err = error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to get beer list"
    );
    return next(err);
  }
};

const searchUsers = async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    const err = error(StatusCodes.BAD_REQUEST, "Query is required");
    return next(err);
  }

  try {
    const users = await User.findAll({
      where: {
        username: {
          [Op.substring]: q,
        },
      },
    });

    return res.status(StatusCodes.OK).json({ payload: users });
  } catch (e) {
    const err = error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to perform query"
    );
    return next(err);
  }
};

module.exports = {
  getAll,
  getUser,
  getUsersBeers,
  searchUsers,
};
