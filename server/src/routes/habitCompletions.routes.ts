import { Router } from "express";
import { habitCompletionsController } from "../controllers/habitCompletions.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { upsertHabitCompletionSchema, toggleHabitCompletionSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.get("/", habitCompletionsController.getAll);
router.post("/", validate(upsertHabitCompletionSchema), habitCompletionsController.upsert);
router.post("/toggle", validate(toggleHabitCompletionSchema), habitCompletionsController.toggle);

export default router;
