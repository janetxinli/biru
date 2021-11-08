"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Beer extends Model {
    static associate(models) {
      const { Beer, User } = models;

      Beer.belongsTo(User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Beer.init(
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      brewer: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT(1),
        allowNull: false,
      },
      servingType: DataTypes.ENUM("draft", "bottle", "can"),
      beerType: DataTypes.ENUM(
        "ale",
        "lager",
        "porter",
        "stout",
        "pilsner",
        "pale ale",
        "wheat",
        "brown",
        "blonde",
        "IPA",
        "sour",
        "other"
      ),
      abv: DataTypes.FLOAT(2),
      ibu: DataTypes.INTEGER,
      notes: DataTypes.STRING,
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Beer",
      timestamps: false,
    }
  );
  return Beer;
};
