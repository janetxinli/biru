const { User } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seedUsers = [
      {
        username: "testuser",
        password: "somethingrandomfornow",
        name: "Test User",
        bio: "Beer lover",
      },
      {
        username: "user123",
        password: "blah",
        name: "Jane Smith",
      },
    ];
    const users = seedUsers.map(async (u) => User.create(u));
    await Promise.all(users);
  },

  down: async (queryInterface, Sequelize) => User.destroy({ truncate: true }),
};
