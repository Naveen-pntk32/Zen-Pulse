import { Request, Response, NextFunction } from "express";
import { subtasksService } from "../services/subtasks.service.js";

export const subtasksController = {
  async getByTaskId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const taskId = req.params.taskId as string;
      const list = await subtasksService.getByTaskId(userId, taskId);

      if (list === null) {
        res.status(404).json({ error: "Parent task not found or access denied" });
        return;
      }

      res.json(list);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const taskId = req.params.taskId as string;
      const subtask = await subtasksService.create(userId, taskId, req.body);

      if (!subtask) {
        res.status(404).json({ error: "Parent task not found or access denied" });
        return;
      }

      res.status(201).json(subtask);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const updated = await subtasksService.update(userId, id, req.body);

      if (!updated) {
        res.status(404).json({ error: "Subtask not found" });
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
      const success = await subtasksService.delete(userId, id);

      if (!success) {
        res.status(404).json({ error: "Subtask not found" });
        return;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
