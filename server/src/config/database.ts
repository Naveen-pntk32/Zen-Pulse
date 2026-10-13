import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "./env.js";
import * as schema from "../db/schema.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let dbInstance: NodePgDatabase<typeof schema> | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = config.databaseUrl;
    const isRemote = connectionString.includes("supabase") || connectionString.includes("sslmode=require") || config.nodeEnv === "production";

    pool = new Pool({
      connectionString: connectionString || "postgresql://postgres:postgres@localhost:5432/productivity_app",
      ssl: isRemote ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.error("[Database Pool Error]:", err.message);
    });
  }
  return pool;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!dbInstance) {
    const p = getPool();
    dbInstance = drizzle(p, { schema });
  }
  return dbInstance;
}

export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    if (!config.databaseUrl) {
      return { connected: false, error: "DATABASE_URL environment variable is not configured." };
    }
    const p = getPool();
    const client = await p.connect();
    try {
      await client.query("SELECT 1");
      return { connected: true };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return { connected: false, error: err?.message || "Failed to connect to database" };
  }
}

export const db = getDb();
