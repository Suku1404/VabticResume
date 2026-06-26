import { Request, Response } from "express";
import pool from "../db/db";
import { aiService } from "../modules/ai";

// Provide career guidance based on user's resume
const getCareerAdvice = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { resumeId, resumeData } = req.body;

    let resumeObj: any = null;

    if (resumeId) {
      const result = await pool.query(
        "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
        [resumeId, userId]
      );
      if (result.rows.length > 0) {
        resumeObj = result.rows[0];
      }
    }

    // Fallback to direct resumeData in payload
    if (!resumeObj && resumeData) {
      resumeObj = {
        title: resumeData.title || "Custom Resume",
        resume_data: resumeData
      };
    }

    if (!resumeObj) {
      // Create a mock structure if they have no resume yet
      resumeObj = {
        title: "Default Resume Profile",
        resume_data: {
          personalInfo: { title: "Software Engineer Intern" },
          skills: ["JavaScript", "HTML", "CSS"],
          education: [],
          experience: []
        }
      };
    }

    console.log(`[AI Career Copilot] Fetching roadmap and advice for user ${userId}...`);
    const advice = await aiService.careerCopilot({
      resumeId,
      resumeData: resumeObj.resume_data
    });
    
    res.json(advice);
  } catch (error: any) {
    console.error("AI Career Copilot advice error:", error.message || error);
    res.status(500).json({
      message: "Failed to load Career Copilot analysis.",
      error: error.message
    });
  }
};

export default {
  getCareerAdvice
};
