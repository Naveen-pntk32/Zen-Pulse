import { Request, Response, NextFunction } from "express";
import { aiService } from "../services/ai.service.js";

export const aiController = {
  async decompose(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { taskId } = req.body;
      const result = await aiService.decomposeTask(userId, taskId);
      if (!result) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getBriefing(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const briefing = await aiService.getDailyBriefing(userId);
      res.json(briefing);
    } catch (err) {
      next(err);
    }
  },
};
