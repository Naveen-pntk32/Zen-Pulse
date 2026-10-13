import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { config } from "./config/env.js";

// Routes
import healthRoutes from "./routes/health.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import subtasksRoutes from "./routes/subtasks.routes.js";
import habitsRoutes from "./routes/habits.routes.js";
import habitCompletionsRoutes from "./routes/habitCompletions.routes.js";
import focusSessionsRoutes from "./routes/focusSessions.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import searchRoutes from "./routes/search.routes.js";
import migrateRoutes from "./routes/migrate.routes.js";
import aiRoutes from "./routes/ai.routes.js";

// Middleware
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

// Trust proxy for rate limiting behind reverse proxies (Vercel, Render, Railway, Nginx)
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes("vercel.app") ||
        origin === config.clientOrigin
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-mock-user-id", "x-mock-user-email"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});
app.use("/api", limiter);

// Request body size limit
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Structured request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (config.nodeEnv !== "test") {
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
      );
    }
  });
  next();
});

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/task-lists", projectsRoutes); // Aliased for task-list service compatibility
app.use("/api/subtasks", subtasksRoutes);
app.use("/api/habits", habitsRoutes);
app.use("/api/habit-completions", habitCompletionsRoutes);
app.use("/api/focus-sessions", focusSessionsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/migrate", migrateRoutes);
app.use("/api/ai", aiRoutes);

// Catch unhandled /api requests
app.use("/api", notFound);

// Serve frontend build if present
const publicDir = path.resolve(process.cwd(), "dist", "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(publicDir, "index.html"));
    }
    next();
  });
}

// Centralized error handler
app.use(errorHandler);

export default app;
