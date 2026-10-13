import { Request, Response, NextFunction } from "express";
import { profileService } from "../services/profile.service.js";

export const profileController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const profile = await profileService.get(user.id, user.email);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await profileService.update(userId, req.body);

      if (!updated) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
};
