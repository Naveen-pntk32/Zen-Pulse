import { Request, Response, NextFunction } from "express";
import { settingsService } from "../services/settings.service.js";

export const settingsController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const settings = await settingsService.get(userId);
      res.json(settings);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await settingsService.update(userId, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async ensureDefaults(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const settings = await settingsService.ensureDefaults(userId);
      res.json(settings);
    } catch (err) {
      next(err);
    }
  },
};
