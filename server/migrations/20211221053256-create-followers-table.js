module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Followers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      followingUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      followedUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Followers");
  },
};
