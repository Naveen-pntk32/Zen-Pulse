import { Request, Response, NextFunction } from "express";
import { projectsService } from "../services/projects.service.js";

export const projectsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const lists = await projectsService.getAll(userId);
      res.json(lists);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const list = await projectsService.getById(userId, id);

      if (!list) {
        res.status(404).json({ error: "Project / Task list not found" });
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
      const list = await projectsService.create(userId, req.body);
      res.status(201).json(list);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const updated = await projectsService.update(userId, id, req.body);

      if (!updated) {
        res.status(404).json({ error: "Project / Task list not found" });
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
      const success = await projectsService.delete(userId, id);

      if (!success) {
        res.status(404).json({ error: "Project / Task list not found" });
        return;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async ensureDefaults(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const lists = await projectsService.ensureDefaults(userId);
      res.json(lists);
    } catch (err) {
      next(err);
    }
  },
};
