module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
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
          notes: "The ultimate Vancouver beer.",
          userId: 1,
          imageUrl:
            "https://res.cloudinary.com/dl7djz7nf/image/upload/v1640747492/m3dnw6kqdgn8jebcaoh5.jpg",
        },
        {
          name: "Jelly King",
          brewer: "Bellwoods Brewery",
          rating: 4.5,
          servingType: "bottle",
          beerType: "sour",
          abv: 5.6,
          date: new Date("2021-09-23"),
          notes: "Possibly my favourite sour of all time!",
          userId: 1,
          imageUrl:
            "https://res.cloudinary.com/dl7djz7nf/image/upload/v1640747370/nmhcn0jvoyx1hmoad9am.jpg",
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
          userId: 1,
        },
        {
          name: "Lavender Sour",
          brewer: "Moody Ales",
          rating: 4,
          servingType: "can",
          beerType: "sour",
          abv: 4.9,
          date: new Date("2021-09-24"),
          notes:
            "So light and refreshing! This sour is great for sipping on the beach.",
          userId: 1,
        },
        {
          name: "Nebulousness",
          brewer: "Brassneck Brewery",
          rating: 4,
          servingType: "can",
          beerType: "IPA",
          abv: 7,
          date: new Date("2021-10-16"),
          userId: 1,
        },
      ],
      {}
    ),

  down: async (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("Beers", null, {}),
};
