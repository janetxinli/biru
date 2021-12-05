require("dotenv").config();
const globalConfig = require("../globalConfig.json");

const PORT = process.env.PORT || 3001;

const IN_PROD = process.env.NODE_ENV === "production";

const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

const SESSION_NAME = globalConfig.SESSION_NAME;
const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_COOKIE_MAX_AGE = 1000 * 60 * 60 * 2;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  PORT,
  IN_PROD,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  SESSION_NAME,
  SESSION_SECRET,
  SESSION_COOKIE_MAX_AGE,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
