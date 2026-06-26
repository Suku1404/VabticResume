import { Router } from "express";
import copilotController from "../controller/copilot.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/advice", authMiddleware, copilotController.getCareerAdvice);

export default router;
