"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Beer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Beer",
      timestamps: false,
    }
  );
  return Beer;
};
