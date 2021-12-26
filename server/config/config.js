const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = require("../utils/config");

module.exports = {
  development: {
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: "biru_db_development",
    host: POSTGRES_HOST,
    dialect: "postgres",
  },
  test: {
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: "biru_db_test",
    host: POSTGRES_HOST,
    dialect: "postgres",
  },
  production: {
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: "biru_db_production",
    host: POSTGRES_HOST,
    dialect: "postgres",
  },
};
