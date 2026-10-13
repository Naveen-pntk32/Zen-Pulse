import { Router } from "express";
import { aiController } from "../controllers/ai.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { decomposeTaskSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.get("/briefing", aiController.getBriefing);
router.post("/decompose", validate(decomposeTaskSchema), aiController.decompose);

export default router;
