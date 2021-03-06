const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      const { Beer, Follower } = models;

      this.hasMany(Beer, {
        foreignKey: "userId",
      });

      this.hasMany(Follower, {
        as: "FollowingUser",
        foreignKey: "followingUserId",
      });

      this.hasMany(Follower, {
        as: "FollowedUser",
        foreignKey: "followedUserId",
      });
    }

    static async hashPassword(password) {
      const saltRounds = 10;

      return bcrypt.hash(password, saltRounds);
    }

    async validatePassword(givenPassword) {
      return bcrypt.compare(givenPassword, this.password);
    }

    // update does not work with scopes
    // manually delete password
    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING(32),
        unique: {
          args: true,
          msg: "Username taken",
        },
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      hooks: {
        beforeCreate: async (user, options) => {
          const hash = await User.hashPassword(user.password);
          user.password = hash;
        },
      },
      modelName: "User",
      timestamps: false,
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },
    }
  );
  return User;
};
