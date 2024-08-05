import { Router } from "express";

import { requireAuth } from "../middlewares/auth.middlewares.js";
import {
  createExpenseGroup,
  inviteUserToGroup,
  listUserGroups,
} from "../controllers/groups.controllers.js";

const router = Router();

router.post("/create-group", requireAuth, createExpenseGroup);
router.get("/list-groups", requireAuth, listUserGroups);
router.get("/join-group/:id", requireAuth, inviteUserToGroup);

export default router;
