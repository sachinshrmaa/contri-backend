import { Router } from "express";

import { requireAuth } from "../middlewares/auth.middlewares.js";
import {
  addGroupExpense,
  getGroupMembersBalance,
} from "../controllers/expenses.controllers.js";

const router = Router();

router.post("/add-expense", requireAuth, addGroupExpense);
router.post("/get-balance", requireAuth, getGroupMembersBalance);

export default router;
