const Pool = require("pg").Pool;

const pool = new Pool({
  user: "janetli",
  host: "localhost",
  database: "beer_journal",
  password: "strawberry",
  port: 5432,
});

module.exports = pool;
