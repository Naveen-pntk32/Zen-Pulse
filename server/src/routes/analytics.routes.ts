import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/summary", analyticsController.getSummary);

export default router;
