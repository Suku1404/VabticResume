import pool from "../db/db";

export async function createNotification(
  userId: number,
  type: "ai" | "resume" | "ats" | "system",
  title: string,
  message: string
) {
  try {
    await pool.query(
      `
      INSERT INTO notifications (user_id, type, title, message)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, type, title, message]
    );
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}
