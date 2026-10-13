import { Request, Response, NextFunction } from "express";
import { config } from "../config/env.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.status || err.statusCode || 500;
  const isProd = config.nodeEnv === "production";

  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);
  if (!isProd && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: err.name || "InternalServerError",
    message: isProd && statusCode === 500 ? "An unexpected server error occurred." : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}
