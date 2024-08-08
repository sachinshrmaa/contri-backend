import { Router } from "express";

import { requireAuth } from "../middlewares/auth.middlewares.js";
import { addGroupExpense } from "../controllers/expenses.controllers.js";

const router = Router();

router.post("/add-expense", requireAuth, addGroupExpense);

export default router;
