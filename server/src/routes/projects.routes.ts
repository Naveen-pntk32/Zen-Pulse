import { Router } from "express";
import { projectsController } from "../controllers/projects.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createTaskListSchema, updateTaskListSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.get("/", projectsController.getAll);
router.get("/:id", projectsController.getById);
router.post("/", validate(createTaskListSchema), projectsController.create);
router.patch("/:id", validate(updateTaskListSchema), projectsController.update);
router.delete("/:id", projectsController.delete);
router.post("/ensure-defaults", projectsController.ensureDefaults);

export default router;
