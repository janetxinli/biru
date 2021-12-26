module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("Users", "imageUrl", {
      type: Sequelize.DataTypes.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("Users", "imageUrl");
  },
};
