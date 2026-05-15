// save resume data to database 

import pool from "../db/db"
import { Request, Response } from "express";
import auuthcontroller from "./auth.controller"

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

export default{
getMyResumes,
createResume
}