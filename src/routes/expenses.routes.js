import { Router } from "express";

import { requireAuth } from "../middlewares/auth.middlewares.js";
import {
  addGroupExpense,
  getGroupMembersBalance,
  listAllMembersGroupBalance,
  listGroupExpenses,
} from "../controllers/expenses.controllers.js";

const router = Router();

router.post("/add-expense", requireAuth, addGroupExpense);
router.post("/get-balance", requireAuth, getGroupMembersBalance);
router.post("/members-balance", requireAuth, listAllMembersGroupBalance);
router.post("/get-expenses", requireAuth, listGroupExpenses);

export default router;
