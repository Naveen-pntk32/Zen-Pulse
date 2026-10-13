import { Request, Response, NextFunction } from "express";
import { focusSessionsService } from "../services/focusSessions.service.js";

export const focusSessionsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { from, to } = req.query as { from?: string; to?: string };
      const sessions = await focusSessionsService.getAll(userId, { from, to });
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const session = await focusSessionsService.getById(userId, id);

      if (!session) {
        res.status(404).json({ error: "Focus session not found" });
        return;
      }

      res.json(session);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const session = await focusSessionsService.create(userId, req.body);
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const updated = await focusSessionsService.update(userId, id, req.body);

      if (!updated) {
        res.status(404).json({ error: "Focus session not found" });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async getDailyTotal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { date, targetId } = req.query as { date?: string; targetId?: string };

      if (!date) {
        res.status(400).json({ error: "Date query parameter is required" });
        return;
      }

      const total = targetId
        ? await focusSessionsService.getDailyTotalForTarget(userId, targetId, date)
        : await focusSessionsService.getDailyTotal(userId, date);

      res.json({ date, targetId: targetId ?? null, totalSeconds: total });
    } catch (err) {
      next(err);
    }
  },
};
