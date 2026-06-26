import pool from "../db/db";
import { Request, Response } from "express";
import crypto from "crypto";
import { logActivity } from "../utils/activityLogger";
import { aiService } from "../modules/ai";
import { createNotification } from "../utils/notificationLogger";
import { parseResumeWithAI } from "../utils/aiResumeParser";
import { classifyResumeWithAI } from "../utils/aiResumeClassifier";
import mammoth from "mammoth";

const { PDFParse } = require("pdf-parse");

// Helper: Save resume version history record
async function createResumeVersion(resumeId: number, title: string, template: string, resumeData: any) {
  try {
    // Get next version number
    const versionResult = await pool.query(
      "SELECT COALESCE(MAX(version_number), 0) as max_ver FROM resume_versions WHERE resume_id = $1",
      [resumeId]
    );
    const nextVersion = parseInt(versionResult.rows[0].max_ver, 10) + 1;

    await pool.query(
      `
      INSERT INTO resume_versions (resume_id, version_number, title, template, resume_data)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [resumeId, nextVersion, title, template, resumeData]
    );
    console.log(`[Version Control] Version ${nextVersion} saved for Resume ${resumeId}`);
  } catch (err) {
    console.error("Failed to save resume version history:", err);
  }
}

// Get resumes of the logged-in user with advanced filtering, sorting, search, and pagination
const getMyResumes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      search,
      template,
      favorite,
      archived,
      sortBy = "updated_at",
      sortOrder = "DESC",
      page = 1,
      limit = 10
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const params: any[] = [userId];
    let query = `
      SELECT id, title, template, status, views, downloads, share_id, is_archived, is_favorite, share_expiration, created_at, updated_at, resume_data
      FROM resumes
      WHERE user_id = $1
    `;

    // Filter by archived
    if (archived === "true") {
      query += ` AND is_archived = TRUE`;
    } else if (archived === "false") {
      query += ` AND is_archived = FALSE`;
    } else {
      // By default, exclude archived resumes
      query += ` AND is_archived = FALSE`;
    }

    // Filter by favorite
    if (favorite === "true") {
      query += ` AND is_favorite = TRUE`;
    }

    // Filter by template type
    if (template) {
      params.push(template);
      query += ` AND template = $${params.length}`;
    }

    // Search query (checks title and fullName)
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR resume_data->'personalInfo'->>'fullName' ILIKE $${params.length})`;
    }

    // Sort order sanitation
    const allowedSortBy = ["updated_at", "created_at", "title"];
    const allowedSortOrder = ["ASC", "DESC"];
    const cleanSortBy = allowedSortBy.includes(sortBy as string) ? sortBy : "updated_at";
    const cleanSortOrder = allowedSortOrder.includes((sortOrder as string).toUpperCase()) ? (sortOrder as string).toUpperCase() : "DESC";

    query += ` ORDER BY ${cleanSortBy} ${cleanSortOrder}`;

    // Pagination
    params.push(Number(limit));
    const limitIndex = params.length;
    query += ` LIMIT $${limitIndex}`;

    params.push(offset);
    const offsetIndex = params.length;
    query += ` OFFSET $${offsetIndex}`;

    const result = await pool.query(query, params);

    // Get count for pagination metadata
    const countParams: any[] = [userId];
    let countQuery = `SELECT COUNT(*) FROM resumes WHERE user_id = $1`;
    if (archived === "true") {
      countQuery += ` AND is_archived = TRUE`;
    } else {
      countQuery += ` AND is_archived = FALSE`;
    }
    if (favorite === "true") countQuery += ` AND is_favorite = TRUE`;
    if (template) {
      countParams.push(template);
      countQuery += ` AND template = $${countParams.length}`;
    }
    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND (title ILIKE $${countParams.length} OR resume_data->'personalInfo'->>'fullName' ILIKE $${countParams.length})`;
    }
    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    res.json({
      resumes: result.rows,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error: any) {
    console.error("Get my resumes error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single resume by ID
const getResumeById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM resumes WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Get resume by ID error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new resume
const createResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, template, status, personalInfo, education, experience, skills, projects } = req.body;

    const resumeTitle = title || "My Resume";
    const selectedTemplate = template || "ats";
    const resumeStatus = status || "Draft";
    const resumeData = {
      personalInfo: personalInfo || {},
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      projects: projects || []
    };

    const result = await pool.query(
      `
      INSERT INTO resumes (user_id, title, template, status, resume_data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [userId, resumeTitle, selectedTemplate, resumeStatus, resumeData]
    );

    const newResume = result.rows[0];
    await logActivity(userId, "CREATED", newResume.id, `Created resume "${resumeTitle}"`);
    await createNotification(userId, "resume", "Resume Created", `Your resume "${resumeTitle}" has been created successfully.`);
    
    // Save version 1
    await createResumeVersion(newResume.id, resumeTitle, selectedTemplate, resumeData);

    res.status(201).json(newResume);
  } catch (error: any) {
    console.error("Create resume error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update an existing resume
const updateResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { title, template, status, personalInfo, education, experience, skills, projects, isAutoSave = false } = req.body;

    const checkResult = await pool.query(
      "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const currentResume = checkResult.rows[0];
    const resumeTitle = title !== undefined ? title : currentResume.title;
    const selectedTemplate = template !== undefined ? template : currentResume.template;
    const resumeStatus = status !== undefined ? status : currentResume.status;
    
    const resumeData = {
      personalInfo: personalInfo || currentResume.resume_data?.personalInfo || {},
      education: education || currentResume.resume_data?.education || [],
      experience: experience || currentResume.resume_data?.experience || [],
      skills: skills || currentResume.resume_data?.skills || [],
      projects: projects || currentResume.resume_data?.projects || []
    };

    // If it's a manual save (not auto-save), archive the CURRENT state to version history before updating
    if (!isAutoSave) {
      await createResumeVersion(currentResume.id, currentResume.title, currentResume.template, currentResume.resume_data);
    }

    const result = await pool.query(
      `
      UPDATE resumes
      SET title = $1, template = $2, status = $3, resume_data = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND user_id = $6
      RETURNING *
      `,
      [resumeTitle, selectedTemplate, resumeStatus, resumeData, id, userId]
    );

    const updated = result.rows[0];
    await logActivity(userId, "UPDATED", updated.id, `${isAutoSave ? "Auto-saved" : "Updated"} resume "${resumeTitle}"`);
    if (!isAutoSave) {
      await createNotification(userId, "resume", "Resume Saved", `Your resume "${resumeTitle}" has been saved successfully.`);
    }

    res.json(updated);
  } catch (error: any) {
    console.error("Update resume error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a resume
const deleteResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const deleted = result.rows[0];
    await logActivity(userId, "DELETED", null, `Deleted resume "${deleted.title}"`);
    await createNotification(userId, "resume", "Resume Deleted", `The resume "${deleted.title}" was permanently deleted.`);

    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error: any) {
    console.error("Delete resume error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Duplicate a resume
const duplicateResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const original = result.rows[0];
    const newTitle = `${original.title} - Copy`;

    const insertResult = await pool.query(
      `
      INSERT INTO resumes (user_id, title, template, status, resume_data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [userId, newTitle, original.template, original.status, original.resume_data]
    );

    const duplicated = insertResult.rows[0];
    await logActivity(userId, "CREATED", duplicated.id, `Duplicated resume "${original.title}" as "${newTitle}"`);
    await createNotification(userId, "resume", "Resume Duplicated", `Your resume "${original.title}" was cloned as "${newTitle}".`);

    // Save version 1 for the clone
    await createResumeVersion(duplicated.id, newTitle, original.template, original.resume_data);

    res.status(201).json(duplicated);
  } catch (error: any) {
    console.error("Duplicate resume error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Rename a resume
const renameResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const result = await pool.query(
      `
      UPDATE resumes
      SET title = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
      `,
      [title.trim(), id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const renamed = result.rows[0];
    await logActivity(userId, "UPDATED", renamed.id, `Renamed resume to "${renamed.title}"`);
    await createNotification(userId, "resume", "Resume Renamed", `Resume was renamed to "${renamed.title}".`);

    res.json(renamed);
  } catch (error: any) {
    console.error("Rename resume error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Toggle public share configuration with optional expiration
const shareResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { enable, expiration } = req.body; // expiration is ISO string or null

    const checkResult = await pool.query(
      "SELECT share_id, title FROM resumes WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const currentShareId = checkResult.rows[0].share_id;
    const title = checkResult.rows[0].title;
    let newShareId = null;
    let expiry = null;

    if (enable) {
      newShareId = currentShareId || crypto.randomBytes(16).toString("hex");
      expiry = expiration ? new Date(expiration) : null;
    }

    const updateResult = await pool.query(
      `
      UPDATE resumes
      SET share_id = $1, share_expiration = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND user_id = $4
      RETURNING share_id, share_expiration
      `,
      [newShareId, expiry, id, userId]
    );

    const shareId = updateResult.rows[0].share_id;
    
    if (shareId) {
      await logActivity(userId, "SHARED", Number(id), `Shared resume "${title}"`);
    }
    await createNotification(
      userId,
      "resume",
      enable ? "Resume Shared" : "Sharing Disabled",
      enable ? `Public sharing enabled for "${title}".` : `Public sharing disabled for "${title}".`
    );

    res.json({ share_id: shareId, share_expiration: updateResult.rows[0].share_expiration });
  } catch (error: any) {
    console.error("Share resume error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get shared resume (public route, checks share expiration)
const getSharedResume = async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;

    // Check expiration first
    const checkExpiry = await pool.query(
      "SELECT share_expiration FROM resumes WHERE share_id = $1",
      [shareId]
    );

    if (checkExpiry.rows.length === 0) {
      return res.status(404).json({ message: "Shared resume not found" });
    }

    const expiry = checkExpiry.rows[0].share_expiration;
    if (expiry && new Date(expiry) < new Date()) {
      return res.status(410).json({ message: "This shared resume link has expired" });
    }

    const result = await pool.query(
      `
      UPDATE resumes
      SET views = views + 1
      WHERE share_id = $1
      RETURNING id, title, template, resume_data, views, created_at, updated_at
      `,
      [shareId]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Get shared resume error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Track download
const downloadResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE resumes
      SET downloads = downloads + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const updated = result.rows[0];
    await logActivity(userId, "DOWNLOADED", updated.id, `Downloaded resume "${updated.title}" PDF`);
    await createNotification(userId, "resume", "Resume Downloaded", `Your resume "${updated.title}" was exported and compiled successfully.`);

    res.json({ success: true, downloads: updated.downloads });
  } catch (error: any) {
    console.error("Download resume tracker error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Toggle Archive status
const toggleArchiveResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { archive } = req.body; // boolean

    const result = await pool.query(
      `
      UPDATE resumes
      SET is_archived = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
      `,
      [archive, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const updated = result.rows[0];
    await logActivity(userId, "UPDATED", updated.id, `${archive ? "Archived" : "Restored"} resume "${updated.title}"`);
    await createNotification(
      userId,
      "resume",
      archive ? "Resume Archived" : "Resume Restored",
      archive ? `The resume "${updated.title}" was sent to the archives.` : `The resume "${updated.title}" was restored to active.`
    );

    res.json(updated);
  } catch (error: any) {
    console.error("Toggle archive error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Toggle Favorite status
const toggleFavoriteResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { favorite } = req.body; // boolean

    const result = await pool.query(
      `
      UPDATE resumes
      SET is_favorite = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
      `,
      [favorite, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const updated = result.rows[0];
    await logActivity(userId, "UPDATED", updated.id, `${favorite ? "Favorited" : "Unfavorited"} resume "${updated.title}"`);
    await createNotification(
      userId,
      "resume",
      favorite ? "Added to Favorites" : "Removed from Favorites",
      favorite ? `Your resume "${updated.title}" was starred.` : `Your resume "${updated.title}" was removed from stars.`
    );

    res.json(updated);
  } catch (error: any) {
    console.error("Toggle favorite error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get version history list of a resume
const getResumeVersions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // Check ownership first
    const checkResult = await pool.query(
      "SELECT id FROM resumes WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const result = await pool.query(
      `
      SELECT id, version_number, title, template, created_at, resume_data
      FROM resume_versions
      WHERE resume_id = $1
      ORDER BY version_number DESC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error: any) {
    console.error("Get versions history error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Restore a historical version
const restoreResumeVersion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id, versionId } = req.params;

    // Verify ownership and fetch current state
    const currentResult = await pool.query(
      "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const currentResume = currentResult.rows[0];

    // Fetch the version row
    const versionResult = await pool.query(
      "SELECT * FROM resume_versions WHERE id = $1 AND resume_id = $2",
      [versionId, id]
    );

    if (versionResult.rows.length === 0) {
      return res.status(404).json({ message: "Selected version not found" });
    }

    const historical = versionResult.rows[0];

    // Save the CURRENT state as a backup version first before overriding it!
    await createResumeVersion(currentResume.id, currentResume.title, currentResume.template, currentResume.resume_data);

    // Apply the restored state
    const updateResult = await pool.query(
      `
      UPDATE resumes
      SET title = $1, template = $2, resume_data = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING *
      `,
      [historical.title, historical.template, historical.resume_data, id, userId]
    );

    const updated = updateResult.rows[0];
    await logActivity(userId, "UPDATED", updated.id, `Restored version ${historical.version_number} of "${historical.title}"`);
    await createNotification(userId, "resume", "Version Restored", `Restored version ${historical.version_number} for resume "${historical.title}".`);

    res.json(updated);
  } catch (error: any) {
    console.error("Restore version error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Improve Resume using Gemini API with robust error handling
const improveResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const jobRole = req.body.jobRole || "";

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF file is required" });
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

    const aiCheck = await classifyResumeWithAI(resumeText);
    if (!aiCheck.isResume || aiCheck.confidence < 60) {
      return res.status(400).json({
        message: "Uploaded document does not look like a resume.",
        reason: aiCheck.reason
      });
    }

    console.log(`[AI Improve] Generating suggestions for user ${userId}...`);
    let parsed: any;
    try {
      parsed = await aiService.improveResume({
        resumeText,
        jobRole
      });
    } catch (apiErr: any) {
      console.error("[AI Improve] Gemini API failure:", apiErr.message || apiErr);
      return res.status(502).json({
        message: "Gemini API unavailable or returned an error.",
        error: apiErr.message
      });
    }

    const latestResume = await pool.query(
      `SELECT * FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`,
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
      const currentResume = latestResume.rows[0];
      // Back up before overwriting
      await createResumeVersion(currentResume.id, currentResume.title, currentResume.template, currentResume.resume_data);

      const updateResult = await pool.query(
        `
        UPDATE resumes
        SET title = $1, resume_data = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
        `,
        [
          `AI Improved - ${parsed.personalInfo.title || "Resume"}`,
          resumeDataPayload,
          currentResume.id
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
      
      // Save version 1
      await createResumeVersion(savedResume.id, savedResume.title, savedResume.template, resumeDataPayload);
    }

    await logActivity(userId, "AI_IMPROVED", savedResume.id, `Optimized resume content with Gemini AI`);
    await createNotification(userId, "ai", "AI Resume Improved", `Your resume has been enhanced with suggestions tailored for "${jobRole || "general role"}".`);

    res.json({
      success: true,
      resume: savedResume,
      suggestions: parsed.suggestions
    });

  } catch (error: any) {
    console.error("AI Improvement handler error:", error.message || error);
    res.status(500).json({
      message: "Server Error during AI Improvement process",
      error: error.message
    });
  }
};

// ATS matching analysis (tailored keywords)
const matchResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: "Resume ID and job description are required" });
    }

    const resumeResult = await pool.query(
      "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
      [resumeId, userId]
    );

    if (resumeResult.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resume = resumeResult.rows[0];

    console.log(`[AI Match] Running analysis for user ${userId} and resume ${resumeId}...`);
    const analysis = await aiService.resumeMatch({
      resumeId,
      resumeData: resume.resume_data,
      jobDescription
    });
    
    // Log the activity
    await logActivity(
      userId,
      "AI_IMPROVED",
      Number(resumeId),
      `Analyzed resume compatibility for "${resume.title}". ATS score: ${analysis.atsScore}%`
    );
    await createNotification(userId, "ats", "ATS Match Analyzed", `ATS compatibility analysis completed for "${resume.title}". Compatibility score is ${analysis.atsScore}%.`);

    res.json(analysis);
  } catch (error: any) {
    console.error("Match resume error:", error.message || error);
    res.status(500).json({
      message: "Failed to perform ATS matching analysis.",
      error: error.message
    });
  }
};

const uploadAndParseResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    let resumeText = "";
    const file_name = req.file.originalname || "Uploaded Resume";

    if (req.file.mimetype === "application/pdf") {
      try {
        const parser = new PDFParse({ data: new Uint8Array(req.file.buffer), verbosity: 0 });
        await parser.load();
        const pdfData = await parser.getText();
        resumeText = pdfData.text || "";
      } catch (pdfErr: any) {
        console.error("PDF Parsing Error:", pdfErr.message);
        return res.status(400).json({ message: "Could not parse PDF. Please upload a valid text-based PDF." });
      }
    } else if (
      req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file_name.toLowerCase().endsWith(".docx")
    ) {
      try {
        const docxResult = await mammoth.extractRawText({ buffer: req.file.buffer });
        resumeText = docxResult.value || "";
      } catch (docxErr: any) {
        console.error("DOCX Parsing Error:", docxErr.message);
        return res.status(400).json({ message: "Could not parse DOCX. Please upload a valid Microsoft Word file." });
      }
    } else {
      return res.status(400).json({ message: "Currently only PDF and DOCX files are supported." });
    }

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ message: "This file does not contain enough readable text." });
    }

    const aiCheck = await classifyResumeWithAI(resumeText);
    if (!aiCheck.isResume || aiCheck.confidence < 60) {
      return res.status(400).json({
        message: "Uploaded document does not look like a resume.",
        reason: aiCheck.reason
      });
    }

    const parsedJson = await parseResumeWithAI(resumeText);
    res.json({ success: true, fileName: file_name, parsedResume: parsedJson });
  } catch (error: any) {
    console.error("Upload and parse resume controller error:", error.message || error);
    res.status(500).json({ message: "Failed to parse resume content automatically." });
  }
};

const extractTextFromFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    let extractedText = "";
    const file_name = req.file.originalname || "Uploaded File";

    if (req.file.mimetype === "application/pdf") {
      try {
        const parser = new PDFParse({ data: new Uint8Array(req.file.buffer), verbosity: 0 });
        await parser.load();
        const pdfData = await parser.getText();
        extractedText = pdfData.text || "";
      } catch (pdfErr: any) {
        console.error("PDF Parsing Error:", pdfErr.message);
        return res.status(400).json({ message: "Could not parse PDF file." });
      }
    } else if (
      req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file_name.toLowerCase().endsWith(".docx")
    ) {
      try {
        const docxResult = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = docxResult.value || "";
      } catch (docxErr: any) {
        console.error("DOCX Parsing Error:", docxErr.message);
        return res.status(400).json({ message: "Could not parse DOCX file." });
      }
    } else if (req.file.mimetype === "text/plain" || file_name.toLowerCase().endsWith(".txt")) {
      extractedText = req.file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ message: "Currently only PDF, DOCX, and TXT files are supported." });
    }

    res.json({ success: true, text: extractedText });
  } catch (error: any) {
    console.error("Extract text controller error:", error.message || error);
    res.status(500).json({ message: "Failed to extract text from file." });
  }
};

export default {
  getMyResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  renameResume,
  shareResume,
  getSharedResume,
  downloadResume,
  toggleArchiveResume,
  toggleFavoriteResume,
  getResumeVersions,
  restoreResumeVersion,
  improveResume,
  matchResume,
  uploadAndParseResume,
  extractTextFromFile
};