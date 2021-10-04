require("dotenv").config();

const PORT = process.env.PORT || 3001;

const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_PORT = process.env.POSTGRES_PORT;

module.exports = {
  PORT,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
};