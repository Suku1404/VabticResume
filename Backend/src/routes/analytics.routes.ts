import { Router } from "express";
import analyticsController from "../controller/analytics.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, analyticsController.getDashboardStats);
router.get("/activities", authMiddleware, analyticsController.getRecentActivities);

export default router;
