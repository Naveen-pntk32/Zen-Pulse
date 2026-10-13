import { Router } from "express";
import { tasksController } from "../controllers/tasks.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.get("/", tasksController.getAll);
router.get("/:id", tasksController.getById);
router.post("/", validate(createTaskSchema), tasksController.create);
router.patch("/:id", validate(updateTaskSchema), tasksController.update);
router.delete("/:id", tasksController.delete);

export default router;
