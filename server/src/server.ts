import { app } from "./app.js";
import { config } from "./config/env.js";
import { checkDatabaseConnection } from "./config/database.js";

async function startServer() {
  const port = config.port;

  // Check DB connection on startup
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    console.log("[Database]: Successfully connected to PostgreSQL.");
  } else {
    console.warn(`[Database Warning]: ${dbStatus.error}`);
  }

  const server = app.listen(port, () => {
    console.log(`===============================================`);
    console.log(`  ZenPulse Backend Server running on port ${port}`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`  API Health: http://localhost:${port}/api/health`);
    console.log(`===============================================`);
  });

  const handleShutdown = (signal: string) => {
    console.log(`[Server]: Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("[Server]: HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => handleShutdown("SIGINT"));
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
}

startServer().catch((err) => {
  console.error("[Server Startup Error]:", err);
  process.exit(1);
});
