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

  CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES USERS(id) ON DELETE CASCADE,
      activity_type VARCHAR(50) NOT NULL,
      resume_id INT REFERENCES resumes(id) ON DELETE SET NULL,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS resume_versions (
      id SERIAL PRIMARY KEY,
      resume_id INT REFERENCES resumes(id) ON DELETE CASCADE,
      version_number INT NOT NULL,
      title VARCHAR(100) NOT NULL,
      template VARCHAR(50) NOT NULL,
      resume_data JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES USERS(id) ON DELETE CASCADE,
      type VARCHAR(20) NOT NULL,
      title VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ats_scans (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES USERS(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      score INT NOT NULL,
      analysis JSONB NOT NULL,
      job_description TEXT,
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
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE resumes ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'status'
    ) THEN
      ALTER TABLE resumes ADD COLUMN status VARCHAR(20) DEFAULT 'Draft';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'template'
    ) THEN
      ALTER TABLE resumes ADD COLUMN template VARCHAR(50) DEFAULT 'ats';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'views'
    ) THEN
      ALTER TABLE resumes ADD COLUMN views INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'downloads'
    ) THEN
      ALTER TABLE resumes ADD COLUMN downloads INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'share_id'
    ) THEN
      ALTER TABLE resumes ADD COLUMN share_id VARCHAR(50) UNIQUE;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'is_archived'
    ) THEN
      ALTER TABLE resumes ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'is_favorite'
    ) THEN
      ALTER TABLE resumes ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'resumes' AND column_name = 'share_expiration'
    ) THEN
      ALTER TABLE resumes ADD COLUMN share_expiration TIMESTAMP DEFAULT NULL;
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