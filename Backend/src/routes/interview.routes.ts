import { Router } from "express";
import interviewController from "../controller/interview.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/questions", authMiddleware, interviewController.generateQuestions);
router.post("/feedback", authMiddleware, interviewController.submitFeedback);

export default router;
