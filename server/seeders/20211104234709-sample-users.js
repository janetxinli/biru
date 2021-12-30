const { User } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seedUsers = [
      {
        username: "demouser",
        password: "birudemo1234",
        name: "Demo User",
        bio: "Beer lover",
      },
    ];
    const users = seedUsers.map(async (u) => User.create(u));
    await Promise.all(users);
  },

  down: async (queryInterface, Sequelize) => User.destroy({ truncate: true }),
};
