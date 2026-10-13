import { Request, Response, NextFunction } from "express";
import { habitCompletionsService } from "../services/habitCompletions.service.js";

export const habitCompletionsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { date, from, to } = req.query as { date?: string; from?: string; to?: string };

      if (date) {
        const completions = await habitCompletionsService.getAllForDate(userId, date);
        res.json(completions);
        return;
      }

      if (from && to) {
        const completions = await habitCompletionsService.getAllBetween(userId, from, to);
        res.json(completions);
        return;
      }

      res.status(400).json({ error: "Missing required query parameter: date or (from and to)" });
    } catch (err) {
      next(err);
    }
  },

  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const completion = await habitCompletionsService.upsert(userId, req.body);
      res.json(completion);
    } catch (err) {
      next(err);
    }
  },

  async toggle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { habitId, date } = req.body;
      const completion = await habitCompletionsService.toggleManual(userId, habitId, date);
      res.json(completion);
    } catch (err) {
      next(err);
    }
  },
};
