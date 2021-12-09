module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Beers", "imageUrl", {
      type: Sequelize.DataTypes.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Beers", "imageUrl");
  },
};
