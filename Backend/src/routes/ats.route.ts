import express from 'express';
import multer from 'multer';
import { classifyResumeWithAI } from '../utils/aiResumeClassifier';
import { calculateATSScore } from '../utils/calculateATSScore';
import { parseResumeWithAI } from '../utils/aiResumeParser';
import { createNotification } from '../utils/notificationLogger';
import { logActivity } from '../utils/activityLogger';
import authMiddleware from '../middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import pool from '../db/db';
import mammoth from 'mammoth';

const { PDFParse } = require('pdf-parse');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

function convertResumeDataToText(data: any): string {
  if (!data) return "";
  let text = "";
  
  if (data.personalInfo) {
    const p = data.personalInfo;
    text += `${p.fullName || ""} ${p.title || ""} ${p.summary || ""}\n`;
  }
  
  if (data.skills) {
    text += "Skills: " + (Array.isArray(data.skills) ? data.skills.join(", ") : String(data.skills)) + "\n";
  }
  
  if (Array.isArray(data.experience)) {
    text += "Experience:\n";
    for (const exp of data.experience) {
      text += `${exp.role || ""} at ${exp.company || ""} - ${exp.description || ""}\n`;
    }
  }

  if (Array.isArray(data.projects)) {
    text += "Projects:\n";
    for (const proj of data.projects) {
      text += `${proj.title || ""} - ${proj.description || ""}\n`;
    }
  }

  if (Array.isArray(data.education)) {
    text += "Education:\n";
    for (const edu of data.education) {
      text += `${edu.degree || ""} from ${edu.school || ""} - ${edu.fieldOfStudy || ""}\n`;
    }
  }

  if (Array.isArray(data.certifications)) {
    text += "Certifications: " + data.certifications.map((c: any) => c.name || c).join(", ") + "\n";
  }

  return text;
}

router.post('/ats-check-score', upload.single('resume'), async (req, res) => {
  try {
    const resumeId = req.body.resumeId;
    let resumeText = '';
    let file_name = 'Selected Resume';
    let userId: number | null = null;

    // Optional authentication check
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
        userId = decoded.id;
      } catch (err) {
        // Guest mode fallback
      }
    }

    if (resumeId) {
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authorization required to select from library.' });
      }
      const resumeResult = await pool.query(
        "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
        [resumeId, userId]
      );
      if (resumeResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }
      const resumeObj = resumeResult.rows[0];
      file_name = resumeObj.title;
      resumeText = convertResumeDataToText(resumeObj.resume_data);
    } else {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Resume file or resumeId is required'
        });
      }
      file_name = req.file.originalname || 'Uploaded Resume';

      if (req.file.mimetype === 'application/pdf') {
        try {
          const parser = new PDFParse({ data: new Uint8Array(req.file.buffer), verbosity: 0 });
          await parser.load();
          const pdfData = await parser.getText();
          resumeText = pdfData.text || '';
        } catch (pdfError: any) {
          console.error('PDF Parse Error:', pdfError.message || pdfError);
          return res.status(400).json({
            success: false,
            message: 'Could not parse PDF file. Please upload a valid text-based PDF resume.',
            debugError: pdfError.message
          });
        }
      } else if (
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file_name.toLowerCase().endsWith('.docx')
      ) {
        try {
          const docxResult = await mammoth.extractRawText({ buffer: req.file.buffer });
          resumeText = docxResult.value || '';
        } catch (docxError: any) {
          console.error('DOCX Parse Error:', docxError.message || docxError);
          return res.status(400).json({
            success: false,
            message: 'Could not parse DOCX file. Please upload a valid word resume.',
            debugError: docxError.message
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Currently only PDF and DOCX files are supported.'
        });
      }
    }

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: 'The selected or uploaded resume does not contain enough readable text.'
      });
    }

    const aiCheck = await classifyResumeWithAI(resumeText);

    if (!aiCheck.isResume || aiCheck.confidence < 60) {
      return res.status(400).json({
        success: false,
        message: 'Uploaded document does not look like a resume.',
        aiReason: aiCheck.reason,
        confidence: aiCheck.confidence
      });
    }

    const jobDescription = typeof req.body?.jobDescription === 'string'
      ? req.body.jobDescription
      : '';

    const atsResult = calculateATSScore(resumeText, jobDescription);

    if (userId) {
      let rId = resumeId ? Number(resumeId) : null;

      if (!rId) {
        // 1. Check if resume already exists
        const parsedResumeData = await parseResumeWithAI(resumeText);
        const fullName = parsedResumeData.personalInfo?.fullName || '';

        const checkResult = await pool.query(
          `SELECT id FROM resumes WHERE user_id = $1 AND (title = $2 OR resume_data->'personalInfo'->>'fullName' = $3)`,
          [userId, file_name, fullName]
        );

        if (checkResult.rows.length > 0) {
          rId = checkResult.rows[0].id;
        } else {
          // Save automatically as a new resume
          const saveResult = await pool.query(
            `
            INSERT INTO resumes (user_id, title, template, status, resume_data)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,
            [userId, file_name, 'ats', 'Completed', parsedResumeData]
          );
          rId = saveResult.rows[0].id;
          
          await logActivity(userId, "CREATED", rId, `Automatically imported resume "${file_name}" from ATS Check`);
          await createNotification(
            userId,
            "resume",
            "Resume Imported",
            `Your resume "${file_name}" was automatically imported and saved to My Resumes from ATS check.`
          );
        }
      }

      // 2. Save ATS scan report in history
      await pool.query(
        `
        INSERT INTO ats_scans (user_id, title, score, analysis, job_description)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [userId, file_name, atsResult.score, atsResult, jobDescription]
      );

      await logActivity(userId, "UPDATED", rId, `ATS Scan Completed. Score: ${atsResult.score}%`);
      await createNotification(
        userId,
        "ats",
        "ATS Scan Completed",
        `Completed ATS scan for "${file_name}". Score: ${atsResult.score}%.`
      );
    }

    return res.status(200).json({
      success: true,
      message: 'ATS score calculated successfully',
      aiCheck,
      ...atsResult
    });
  } catch (error: any) {
    console.error('ATS Check Error:', error.message || error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while checking ATS score'
    });
  }
});

// Fetch past scans
router.get('/scans', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const result = await pool.query(
      `SELECT id, title, score, created_at FROM ats_scans WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("Fetch past scans error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Fetch scan report detail
router.get('/scans/:id', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM ats_scans WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Fetch past scan detail error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
