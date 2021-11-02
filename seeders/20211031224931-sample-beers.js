"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      "Beers",
      [
        {
          name: "33 Acres of Ocean",
          brewer: "33 Acres",
          rating: 4.5,
          servingType: "bottle",
          beerType: "pale ale",
          abv: 5.3,
          date: new Date("2021-09-20"),
          notes:
            "This is a classic everyday beer made for glugging. Citrusy, hoppey and piney.",
        },
        {
          name: "Electric Unicorn",
          brewer: "Phillips",
          rating: 3.5,
          servingType: "can",
          beerType: "IPA",
          abv: 6.5,
          ibu: 75,
          date: new Date("2021-09-23"),
          notes:
            "A light, citrusy and bitter IPA. Great for sipping on the beach or watching a game",
        },
        {
          name: "Fluffy Cloud IPA",
          brewer: "33 Acres",
          rating: 4,
          servingType: "can",
          beerType: "IPA",
          abv: 6.5,
          date: new Date("2021-10-01"),
          notes: "This is a lovely hazy IPA with citrusy notes.",
        },
        {
          name: "Lavender Sour",
          brewer: "Moody Ales",
          rating: 4,
          servingType: "can",
          beerType: "sour",
          abv: 4.9,
          date: new Date("2021-09-24"),
        },
        {
          name: "Nebulousness",
          brewer: "Brassneck",
          rating: 4,
          servingType: "can",
          beerType: "IPA",
          abv: 7,
          date: new Date("2021-10-16"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Beers", null, {});
  },
};
