import { Router } from "express";
import { focusSessionsController } from "../controllers/focusSessions.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createFocusSessionSchema, updateFocusSessionSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.get("/", focusSessionsController.getAll);
router.get("/stats", focusSessionsController.getDailyTotal);
router.get("/:id", focusSessionsController.getById);
router.post("/", validate(createFocusSessionSchema), focusSessionsController.create);
router.patch("/:id", validate(updateFocusSessionSchema), focusSessionsController.update);

export default router;
