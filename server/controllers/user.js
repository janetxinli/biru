const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const { Beer, User } = require("../models");
const error = require("../utils/error");

const createUser = async (req, res, next) => {
  const { username, password, name, bio } = req.body;

  try {
    await User.create({
      username,
      password,
      name,
      bio: bio || null,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (e) {
    if (e.errors[0].message === "Username taken") {
      const err = error(StatusCodes.CONFLICT, e.message);
      return next(err);
    }
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    return next(err);
  }
};

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
  const { username } = req.params;

  try {
    const user = await User.findAll({
      where: {
        username,
      },
    });

    if (!user.length) {
      // No user is found
      const err = error(StatusCodes.NOT_FOUND, "User not found");
      return next(err);
    }

    return res.status(StatusCodes.OK).json({ payload: user[0] });
  } catch (e) {
    const err = error(StatusCodes.BAD_REQUEST, "Cannot get user");
    return next(err);
  }
};

const getProfile = async (req, res, next) => {
  const { username } = req.params;
  const { beerType, sort, descending } = req.query;

  // define query object
  const beerQuery = {};

  // filter by beerType
  if (beerType) {
    beerQuery.beerType = {
      [Op.in]: beerType,
    };
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

  try {
    const data = await User.findAll({
      where: {
        username,
      },
      include: {
        model: Beer,
        required: false,
        where: beerQuery,
      },
      order: [[{ model: Beer }, ...order]],
    });

    return res.json({ payload: data[0] });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
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
          [Op.not]: req.user.username,
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
  createUser,
  getAll,
  getUser,
  getProfile,
  searchUsers,
};
