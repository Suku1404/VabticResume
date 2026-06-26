import { Request, Response } from "express";
import { aiService } from "../modules/ai";
import { logActivity } from "../utils/activityLogger";

// Generate interview questions based on category and difficulty
const generateQuestions = async (req: Request, res: Response) => {
  try {
    const { category, difficulty, jobRole } = req.body;
    
    if (!category || !difficulty) {
      return res.status(400).json({ message: "Category and difficulty are required" });
    }

    console.log(`[AI Interview] Generating questions for category ${category}, difficulty ${difficulty}...`);
    const questions = await aiService.generateInterviewQuestions({
      category,
      difficulty,
      jobRole
    });
    
    res.json(questions);
  } catch (error: any) {
    console.error("Generate interview questions error:", error.message || error);
    res.status(500).json({
      message: "Failed to generate interview questions.",
      error: error.message
    });
  }
};

// Evaluate user answer and provide AI feedback
const submitFeedback = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { question, answer, difficulty, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    console.log(`[AI Interview] Evaluating answer to: "${question.substring(0, 30)}..."`);
    const feedback = await aiService.submitFeedback({
      question,
      answer,
      difficulty,
      category
    });
    
    // Log the activity
    await logActivity(
      userId,
      "INTERVIEW_PRACTICE",
      null,
      `Completed practice answer for "${category || "General"}" interview prep. Score: ${feedback.score}%`
    );

    res.json(feedback);
  } catch (error: any) {
    console.error("Submit interview feedback error:", error.message || error);
    res.status(500).json({
      message: "Failed to process interview answer feedback.",
      error: error.message
    });
  }
};

export default {
  generateQuestions,
  submitFeedback
};
