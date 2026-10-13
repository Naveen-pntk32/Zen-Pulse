import { Request, Response, NextFunction } from "express";
import { tasksService } from "../services/tasks.service.js";

export const tasksController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const listId = req.query.listId === "null" ? null : (req.query.listId as string | undefined);
      const status = req.query.status as string | undefined;
      const priority = req.query.priority as string | undefined;

      const tasks = await tasksService.getAll(userId, { listId, status, priority });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const task = await tasksService.getById(userId, id);

      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const task = await tasksService.create(userId, req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const updated = await tasksService.update(userId, id, req.body);

      if (!updated) {
        res.status(404).json({ error: "Task not found" });
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
      const success = await tasksService.delete(userId, id);

      if (!success) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
