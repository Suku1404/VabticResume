import pool from "./db/db";

async function testDb() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connection successful! Current time:", result.rows[0].now);
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Existing tables:");
    tables.rows.forEach(row => console.log("-", row.table_name));
    
    process.exit(0);
  } catch (err: any) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

testDb();
