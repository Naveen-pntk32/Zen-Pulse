import { Router } from "express";
import { profileController } from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.get("/", profileController.get);
router.patch("/", validate(updateProfileSchema), profileController.update);

export default router;
