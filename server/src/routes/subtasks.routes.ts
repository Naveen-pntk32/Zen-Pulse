import { Router } from "express";
import { subtasksController } from "../controllers/subtasks.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createSubtaskSchema, updateSubtaskSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

// List and create for a specific task
router.get("/task/:taskId", subtasksController.getByTaskId);
router.post("/task/:taskId", validate(createSubtaskSchema), subtasksController.create);

// Update and delete single subtask
router.patch("/:id", validate(updateSubtaskSchema), subtasksController.update);
router.delete("/:id", subtasksController.delete);

export default router;
