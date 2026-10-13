import { Router } from "express";
import { habitsController } from "../controllers/habits.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createHabitSchema, updateHabitSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.get("/", habitsController.getAll);
router.get("/:id", habitsController.getById);
router.post("/", validate(createHabitSchema), habitsController.create);
router.patch("/:id", validate(updateHabitSchema), habitsController.update);
router.delete("/:id", habitsController.delete);

export default router;
