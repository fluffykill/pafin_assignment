import pg from "pg";
const { Pool } = pg;

const user = process.env.DBUSER;
const password = process.env.DBPASS;

const pool = new Pool({
  user,
  host: "localhost",
  database: "pafin",
  password,
  port: 5432
});

export default pool;