require("pg").defaults.parseInt8 = true;

const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const { Beer, Follower, User, Sequelize, sequelize } = require("../models");
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

const editUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, bio, imageUrl } = req.body;

  if (req.user.id !== parseInt(id)) {
    const err = error(StatusCodes.UNAUTHORIZED, "Unauthorized to edit user");
    return next(err);
  }

  if (!name) {
    const err = error(StatusCodes.BAD_REQUEST, "Name is required");
    return next(err);
  }

  try {
    const updated = await User.update(
      {
        name,
        bio,
        imageUrl,
      },
      {
        where: {
          id,
        },
        returning: true,
      }
    );

    return res.status(StatusCodes.OK).json({ payload: updated[1][0] });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to edit user");
    return next(err);
  }
};

const getProfile = async (req, res, next) => {
  const { username } = req.params;
  const { beerType, sort, descending } = req.query;

  const profileUser = await User.findOne({
    where: { username },
  });

  if (!profileUser) {
    const err = error(StatusCodes.NOT_FOUND, "User does not exist");
    return next(err);
  }

  const currentUser = req.user.username === profileUser.username;
  const currentUserFollows = currentUser
    ? undefined
    : await Follower.checkFollowing(req.user.id, profileUser.id);

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
    const data = await User.findOne({
      where: {
        username,
      },
      include: [
        {
          model: Beer,
          required: false,
          where: beerQuery,
        },
      ],
      order: [[{ model: Beer }, ...order]],
    });

    const followingUsers = await Follower.count({
      where: {
        followingUserId: profileUser.id,
      },
    });

    const followedByUsers = await Follower.count({
      where: {
        followedUserId: profileUser.id,
      },
    });

    data.setDataValue("followingUsers", followingUsers);
    data.setDataValue("followedByUsers", followedByUsers);
    data.setDataValue("currentUser", currentUser);
    data.setDataValue("currentUserFollows", currentUserFollows);

    return res.json({ payload: data });
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

const followUser = async (req, res, next) => {
  const { user } = req;
  const followedUserId = req.params.id;

  const alreadyFollowing = await Follower.checkFollowing(
    user.id,
    followedUserId
  );

  if (alreadyFollowing) {
    const err = error(
      StatusCodes.CONFLICT,
      `User ${user.id} already follows ${followedUserId}`
    );

    return next(err);
  }

  try {
    await Follower.create({
      followingUserId: user.id,
      followedUserId,
    });

    return res.status(StatusCodes.NO_CONTENT).end();
  } catch (e) {
    const err = error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to follow user"
    );

    return next(err);
  }
};

const unfollowUser = async (req, res, next) => {
  const { user } = req;
  const followedUserId = req.params.id;

  const following = Follower.checkFollowing(user.id, followedUserId);

  if (!following) {
    const err = error(
      StatusCodes.CONFLICT,
      `User ${user.id} does not follow ${followedUserId}`
    );

    return next(err);
  }

  try {
    Follower.destroy({
      where: {
        followingUserId: user.id,
        followedUserId,
      },
    });

    return res.status(StatusCodes.NO_CONTENT).end();
  } catch (e) {
    const err = error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to unfollow user"
    );

    return next(err);
  }
};

const getFollowing = async (req, res, next) => {
  const { id } = req.params;

  try {
    const following = await Follower.findAll({
      where: {
        followingUserId: id,
      },
      include: {
        model: User,
        as: "FollowedUser",
      },
    });

    return res.status(StatusCodes.OK).json({ payload: following });
  } catch (e) {
    const err = error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to get followed users"
    );

    return next(err);
  }
};

const getFollowers = async (req, res, next) => {
  const { id } = req.params;

  try {
    const followers = await Follower.findAll({
      where: {
        followedUserId: id,
      },
      include: {
        model: User,
        as: "FollowingUser",
      },
    });

    return res.status(StatusCodes.OK).json({ payload: followers });
  } catch (e) {
    const err = error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to get followers"
    );

    return next(err);
  }
};

const getFeed = async (req, res, next) => {
  const { id } = req.params;
  let page;
  if (req.query.page) {
    page = req.query.page;
  } else {
    page = 0;
  }

  const limit = 10;

  try {
    const feed = await Beer.findAll({
      order: [["date"]],
      limit,
      offset: limit * page,
      subQuery: false,
      include: [
        {
          model: User,
          required: true,
          include: [
            {
              model: Follower,
              as: "FollowedUser",
              where: {
                followingUserId: id,
              },
              attributes: [],
            },
          ],
        },
      ],
    });

    return res.status(StatusCodes.OK).send({ payload: feed });
  } catch (e) {
    const err = error(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to get feed");

    return next(err);
  }
};

module.exports = {
  createUser,
  getAll,
  getUser,
  editUser,
  getProfile,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFeed,
};
