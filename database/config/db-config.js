import pg from "pg";
import dotenv from "dotenv";
const { Pool } = pg;

export const ConnectionPool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME
});