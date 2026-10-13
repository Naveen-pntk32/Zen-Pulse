import { Router } from "express";
import { settingsController } from "../controllers/settings.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { updateSettingsSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.get("/", settingsController.get);
router.patch("/", validate(updateSettingsSchema), settingsController.update);
router.post("/ensure-defaults", settingsController.ensureDefaults);

export default router;
