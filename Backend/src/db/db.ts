import { Pool } from "pg";
// Database connection and table initialization
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS USERS (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS resumes (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES USERS(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL,
      resume_data JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const migrateTablesQuery = `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'resume_data'
    ) THEN
      ALTER TABLE resumes ADD COLUMN resume_data JSONB;
      RAISE NOTICE 'Migration: Added resume_data column to resumes table.';
    END IF;
  END;
  $$;
`;

pool.connect()
  .then(async (client) => {
    console.log("PostgreSQL Connected");
    try {
      await client.query(createTablesQuery);
      await client.query(migrateTablesQuery);
      console.log("Database tables initialized successfully");
    } catch (tableErr: any) {
      console.error("Error creating database tables:", tableErr.message);
    } finally {
      client.release();
    }
  })
  .catch((err: Error) => {
    console.log("Database Connection Error:", err.message);
  });

export default pool;