import { Request, Response } from "express";
import pool from "../db/db";

// Get dashboard statistics
const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // 1. Total Resumes
    const totalResumesResult = await pool.query(
      "SELECT COUNT(*) FROM resumes WHERE user_id = $1",
      [userId]
    );
    const totalResumes = parseInt(totalResumesResult.rows[0].count, 10);

    // 2. Resume Downloads & Views
    const aggregateResult = await pool.query(
      `
      SELECT 
        COALESCE(SUM(downloads), 0) as total_downloads,
        COALESCE(SUM(views), 0) as total_views
      FROM resumes
      WHERE user_id = $1
      `,
      [userId]
    );
    const totalDownloads = parseInt(aggregateResult.rows[0].total_downloads, 10);
    const totalViews = parseInt(aggregateResult.rows[0].total_views, 10);

    // 3. AI Improvements Used
    const aiImprovementsResult = await pool.query(
      `
      SELECT COUNT(*) 
      FROM activities 
      WHERE user_id = $1 AND activity_type = 'AI_IMPROVED'
      `,
      [userId]
    );
    const aiImprovementsUsed = parseInt(aiImprovementsResult.rows[0].count, 10);

    // 4. Last Edited Resume
    const lastEditedResult = await pool.query(
      `
      SELECT title, updated_at 
      FROM resumes 
      WHERE user_id = $1 
      ORDER BY updated_at DESC 
      LIMIT 1
      `,
      [userId]
    );
    const lastEditedResume = lastEditedResult.rows[0]
      ? {
          title: lastEditedResult.rows[0].title,
          updatedAt: lastEditedResult.rows[0].updated_at
        }
      : null;

    // 5. Avg ATS Score (Calculate based on content completeness)
    const resumesResult = await pool.query(
      "SELECT resume_data FROM resumes WHERE user_id = $1",
      [userId]
    );
    
    let totalScore = 0;
    const count = resumesResult.rows.length;

    if (count > 0) {
      resumesResult.rows.forEach((row) => {
        const data = row.resume_data || {};
        let score = 40; // baseline

        // Personal Info completeness
        if (data.personalInfo?.fullName) score += 5;
        if (data.personalInfo?.summary) score += 10;
        if (data.personalInfo?.email) score += 5;
        if (data.personalInfo?.phone) score += 5;
        
        // Skills
        if (Array.isArray(data.skills) && data.skills.length > 0) {
          score += Math.min(15, data.skills.length * 2.5);
        }

        // Education
        if (Array.isArray(data.education) && data.education.length > 0) {
          score += Math.min(10, data.education.length * 5);
        }

        // Experience
        if (Array.isArray(data.experience) && data.experience.length > 0) {
          score += Math.min(10, data.experience.length * 5);
        }

        totalScore += score;
      });
    }

    const avgAtsScore = count > 0 ? Math.round(totalScore / count) : 0;

    res.json({
      totalResumes,
      avgAtsScore: `${avgAtsScore}%`,
      totalDownloads,
      totalViews,
      aiImprovementsUsed,
      lastEditedResume
    });
  } catch (error: any) {
    console.error("Get dashboard statistics error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get recent activities timeline
const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await pool.query(
      `
      SELECT a.id, a.activity_type, a.details, a.created_at, r.title as resume_title
      FROM activities a
      LEFT JOIN resumes r ON a.resume_id = r.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
      LIMIT 10
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error: any) {
    console.error("Get recent activities error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default {
  getDashboardStats,
  getRecentActivities
};
