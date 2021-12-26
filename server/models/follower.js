const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    static associate(models) {
      const { User } = models;

      this.belongsTo(User, {
        as: "FollowingUser",
        foreignKey: "followingUserId",
      });

      this.belongsTo(User, {
        as: "FollowedUser",
        foreignKey: "followedUserId",
      });
    }

    static async checkFollowing(followingUserId, followedUserId) {
      const res = await this.findAll({
        where: {
          followingUserId,
          followedUserId,
        },
      });

      return res.length !== 0;
    }
  }

  Follower.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
    }
  );

  return Follower;
};
