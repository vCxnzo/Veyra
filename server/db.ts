import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

db.query("SELECT NOW()")
  .then((result) => {
    console.log("✅ PostgreSQL Connected!");
    console.log("Server Time:", result.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Error:", err);
  });