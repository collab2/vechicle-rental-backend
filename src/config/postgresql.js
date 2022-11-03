const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db.qjlaozdcvbfgusyvcugh.supabase.co",
  database: "postgres",
  password: "aDgINwIKTYjtfe0A",
  port: 5432,
});

module.exports = pool;
