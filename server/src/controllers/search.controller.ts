import { Request, Response, NextFunction } from "express";
import { searchService } from "../services/search.service.js";

export const searchController = {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const query = (req.query.q as string) || "";
      const results = await searchService.search(userId, query);
      res.json(results);
    } catch (err) {
      next(err);
    }
  },
};
