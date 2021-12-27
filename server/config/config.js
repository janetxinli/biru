const {
  POSTGRES_HOST_DEV,
  POSTGRES_USER_DEV,
  POSTGRES_PASSWORD_DEV,
  POSTGRES_HOST_PROD,
  POSTGRES_USER_PROD,
  POSTGRES_DATABASE_PROD,
  POSTGRES_PASSWORD_PROD,
} = require("../utils/config");

module.exports = {
  development: {
    username: POSTGRES_USER_DEV,
    password: POSTGRES_PASSWORD_DEV,
    database: "biru_db_development",
    host: POSTGRES_HOST_DEV,
    dialect: "postgres",
  },
  test: {
    username: POSTGRES_USER_DEV,
    password: POSTGRES_PASSWORD_DEV,
    database: "biru_db_test",
    host: POSTGRES_HOST_DEV,
    dialect: "postgres",
  },
  production: {
    username: POSTGRES_USER_PROD,
    password: POSTGRES_PASSWORD_PROD,
    database: POSTGRES_DATABASE_PROD,
    host: POSTGRES_HOST_PROD,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
