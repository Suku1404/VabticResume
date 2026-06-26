import pool from "../db/db";

export async function logActivity(
  userId: number,
  activityType: string,
  resumeId: number | null,
  details: string
) {
  try {
    await pool.query(
      `
      INSERT INTO activities (user_id, activity_type, resume_id, details)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, activityType, resumeId, details]
    );
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
