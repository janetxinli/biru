"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Beers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      brewer: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      rating: {
        type: Sequelize.FLOAT(1),
        allowNull: false,
      },
      servingType: {
        type: Sequelize.ENUM("draft", "bottle", "can"),
      },
      beerType: {
        type: Sequelize.ENUM(
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
      },
      abv: {
        type: Sequelize.FLOAT(2),
      },
      ibu: {
        type: Sequelize.INTEGER,
      },
      notes: {
        type: Sequelize.STRING,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Beers");
  },
};
