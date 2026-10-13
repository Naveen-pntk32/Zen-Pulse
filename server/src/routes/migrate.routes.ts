import { Router } from "express";
import { migrateController } from "../controllers/migrate.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { migratePayloadSchema } from "../schemas/index.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(migratePayloadSchema), migrateController.importData);

export default router;
