import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes.js";
import groupRoutes from "./src/routes/groups.routes.js";
import expenseRoutes from "./src/routes/expenses.routes.js";
import activityRoues from "./src/routes/activity.routes.js";

// config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://contri.sachinbuilds.in",
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/ping", async (req, res) => {
  res.json({ message: "pong" });
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/activities", activityRoues);

// server port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
