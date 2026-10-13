import fs from "fs";
import path from "path";
import { getPool } from "../config/database.js";

export async function runMigrations() {
  console.log("[Migration]: Checking database connection and applying migrations...");
  const pool = getPool();
  const client = await pool.connect();
  try {
    const migrationsDir = path.resolve(process.cwd(), "supabase", "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log("[Migration]: No migrations directory found at", migrationsDir);
      return;
    }

    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
    console.log(`[Migration]: Found ${files.length} migration file(s).`);

    for (const file of files) {
      console.log(`[Migration]: Running ${file}...`);
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await client.query(sqlContent);
      console.log(`[Migration]: Successfully executed ${file}`);
    }

    console.log("[Migration]: All database migrations applied successfully.");
  } catch (error: any) {
    console.error("[Migration Error]:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.endsWith("migrate.ts") || process.argv[1]?.endsWith("migrate.js")) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
