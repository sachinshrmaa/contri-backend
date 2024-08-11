import { Router } from "express";

import {
  SignUp,
  LogIn,
  LogOut,
  deactivateUserAccount,
  updateUserAccount,
} from "../controllers/auth.controllers.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/login", LogIn);
router.post("/signup", SignUp);
router.get("/logout", requireAuth, LogOut);
router.get("/deactivate", requireAuth, deactivateUserAccount);
router.post("/update", requireAuth, updateUserAccount);
router.get("/", requireAuth, (req, res) => {
  res.json({ message: "Authenticated", user: req.user });
});

export default router;
