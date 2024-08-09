import { Router } from "express";

import { requireAuth } from "../middlewares/auth.middlewares.js";
import {
  createExpenseGroup,
  editExpenseGroup,
  inviteUserToGroup,
  leaveExpenseGroup,
  listGroupMembers,
  listUserGroups,
} from "../controllers/groups.controllers.js";
import { sendGroupInvite } from "../controllers/expenses.controllers.js";

const router = Router();

router.post("/create-group", requireAuth, createExpenseGroup);
router.get("/list-groups", requireAuth, listUserGroups);
router.get("/join-group/:id", requireAuth, inviteUserToGroup);
router.post("/list-members", requireAuth, listGroupMembers);
router.post("/leave-group", requireAuth, leaveExpenseGroup);
router.post("/edit-group/:id", requireAuth, editExpenseGroup);
router.post("/send-invite", requireAuth, sendGroupInvite);

export default router;
