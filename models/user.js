const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      const { Beer, User } = models;

      User.hasMany(Beer, {
        foreignKey: "userId",
      });
    }

    static async hashPassword(password) {
      const saltRounds = 10;

      return await bcrypt.hash(password, saltRounds);
    }

    async validatePassword(givenPassword) {
      return await bcrypt.compare(givenPassword, this.password);
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
