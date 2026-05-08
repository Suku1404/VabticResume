import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_PASSWORD TYPE:", typeof process.env.DB_PASSWORD);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.connect()
  .then(() => {
    console.log("PostgreSQL Connected");
  })
  .catch((err:Error) => {
    console.log("Database Connection Error:", err.message);
  });

export default pool;