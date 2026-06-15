// save resume data to database 

import pool from "../db/db"
import { Request, Response } from "express";
import auuthcontroller from "./auth.controller"
import axios from "axios";

const { PDFParse } = require('pdf-parse');

 const createResume = async (
  req: Request,
  res: Response
) => {

  try {

    const userId = (req as any).user.id;

    const {
      title,
      personalInfo,
      education,
      experience,
      skills,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO resumes
      (
        user_id,
        title,
        resume_data
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        userId,
        title,
        {
          personalInfo,
          education,
          experience,
          skills,
        },
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

 const getMyResumes = async (
  req: Request,
  res: Response
) => {
  try {
   const userId = (req as any).user.id;

    const result = await pool.query(
      `
      SELECT * FROM resumes
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getResumeById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT * FROM resumes
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const improveResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are supported" });
    }

    let resumeText = "";
    try {
      const parser = new PDFParse({ data: new Uint8Array(req.file.buffer), verbosity: 0 });
      await parser.load();
      const pdfData = await parser.getText();
      resumeText = pdfData.text || "";
    } catch (pdfErr: any) {
      console.error("PDF Parsing Error:", pdfErr.message || pdfErr);
      return res.status(400).json({ message: "Could not parse PDF. Please upload a valid text-based PDF." });
    }

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ message: "This PDF does not contain enough readable text" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Google Gemini API key is missing on the server" });
    }

    const prompt = `
You are an expert resume writer and career consultant.
Examine the following resume text and perform a complete improvement.

Your tasks:
1. Examine the resume using these parameters: "Impact of descriptions" (quantifiable metrics), "Grammar & Spellings", "Clarity & Style", "Skills coverage".
2. Provide concrete observations and an action plan for each parameter.
3. Rewrite the entire resume into a highly polished, professional, and ATS-friendly format.
4. Output the result ONLY as a valid JSON object with the following structure:
{
  "personalInfo": {
    "fullName": "Polished name",
    "title": "Polished professional title",
    "email": "email",
    "phone": "phone",
    "location": "location",
    "summary": "Polished professional summary"
  },
  "education": [
    {
      "degree": "Degree",
      "institute": "Institute/University",
      "location": "Location",
      "startYear": "Start Year",
      "endYear": "End Year"
    }
  ],
  "experience": [
    {
      "role": "Job Role",
      "company": "Company Name",
      "location": "Location",
      "startDate": "Start Date",
      "endDate": "End Date",
      "description": "Polished description using strong action verbs"
    }
  ],
  "skills": ["Skill1", "Skill2"],
  "suggestions": [
    {
      "parameter": "Impact of descriptions",
      "observations": "Detailed observations.",
      "actionPlan": "Action plan."
    },
    {
      "parameter": "Grammar & Spellings",
      "observations": "Observations.",
      "actionPlan": "Action plan."
    },
    {
      "parameter": "Clarity & Style",
      "observations": "Observations.",
      "actionPlan": "Action plan."
    },
    {
      "parameter": "Skills coverage",
      "observations": "Observations.",
      "actionPlan": "Action plan."
    }
  ]
}

Resume Text:
${resumeText}
`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      },
      { timeout: 60000 }
    );

    const aiText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanJson = aiText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    // Save or update user's resume in database
    const latestResume = await pool.query(
      `SELECT id FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    let savedResume;
    const resumeDataPayload = {
      personalInfo: parsed.personalInfo,
      education: parsed.education,
      experience: parsed.experience,
      skills: parsed.skills
    };

    if (latestResume.rows.length > 0) {
      const resumeId = latestResume.rows[0].id;
      const updateResult = await pool.query(
        `
        UPDATE resumes
        SET title = $1, resume_data = $2, created_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
        `,
        [
          `AI Improved - ${parsed.personalInfo.title || "Resume"}`,
          resumeDataPayload,
          resumeId
        ]
      );
      savedResume = updateResult.rows[0];
    } else {
      const insertResult = await pool.query(
        `
        INSERT INTO resumes (user_id, title, resume_data)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
          userId,
          `AI Improved - ${parsed.personalInfo.title || "Resume"}`,
          resumeDataPayload
        ]
      );
      savedResume = insertResult.rows[0];
    }

    res.json({
      success: true,
      resume: savedResume,
      suggestions: parsed.suggestions
    });

  } catch (error: any) {
    console.error("AI Improvement error:", error.message || error);
    res.status(500).json({
      message: "Server Error during AI Improvement process",
      error: error.message
    });
  }
};

export default {
  getMyResumes,
  createResume,
  getResumeById,
  improveResume
};