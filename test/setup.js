const { sequelize } = require("../models");

afterAll(() => sequelize.close());
