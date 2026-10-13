import { Router } from "express";
import { checkDatabaseConnection } from "../config/database.js";

const router = Router();

router.get("/", async (_req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStatus.connected ? "connected" : "disconnected",
  });
});

export default router;
