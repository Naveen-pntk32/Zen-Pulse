import { Request, Response, NextFunction } from "express";
import { habitsService } from "../services/habits.service.js";

export const habitsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const includeArchived = req.query.includeArchived === "true";
      const habits = await habitsService.getAll(userId, { includeArchived });
      res.json(habits);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const habit = await habitsService.getById(userId, id);

      if (!habit) {
        res.status(404).json({ error: "Habit not found" });
        return;
      }

      res.json(habit);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const habit = await habitsService.create(userId, req.body);
      res.status(201).json(habit);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const updated = await habitsService.update(userId, id, req.body);

      if (!updated) {
        res.status(404).json({ error: "Habit not found" });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const success = await habitsService.delete(userId, id);

      if (!success) {
        res.status(404).json({ error: "Habit not found" });
        return;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
