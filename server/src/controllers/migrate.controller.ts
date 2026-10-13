import { Request, Response, NextFunction } from "express";
import { migrateService } from "../services/migrate.service.js";

export const migrateController = {
  async importData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await migrateService.importUserData(userId, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
