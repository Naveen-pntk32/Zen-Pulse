import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service.js";

export const analyticsController = {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const periodParam = (req.query.period as string) || "day";
      const period = ["day", "week", "month"].includes(periodParam)
        ? (periodParam as "day" | "week" | "month")
        : "day";

      const summary = await analyticsService.getSummary(userId, period);
      res.json(summary);
    } catch (err) {
      next(err);
    }
  },
};
