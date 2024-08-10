import { Router } from "express";

import { requireAuth } from "../middlewares/auth.middlewares.js";
import { listUserActivities } from "../controllers/activity.controllers.js";

const router = Router();

router.get("/all", requireAuth, listUserActivities);

export default router;
