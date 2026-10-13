import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://bzxqwgofanvzoanxfepl.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET || "",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  get allowMockAuth() {
    return process.env.ALLOW_MOCK_AUTH === "true" || process.env.NODE_ENV === "test";
  },
};
