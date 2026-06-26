import { Request, Response } from "express";
import pool from "../db/db";

// Get user notifications
const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await pool.query(
      `
      SELECT id, type, title, message, read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error: any) {
    console.error("Get notifications error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark all notifications as read
const markAllRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    await pool.query(
      `
      UPDATE notifications
      SET read = TRUE
      WHERE user_id = $1
      `,
      [userId]
    );

    res.json({ success: true, message: "All notifications marked as read." });
  } catch (error: any) {
    console.error("Mark notifications read error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a single notification
const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ success: true, message: "Notification dismissed successfully." });
  } catch (error: any) {
    console.error("Delete notification error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete all notifications for user
const clearAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    await pool.query(
      `
      DELETE FROM notifications
      WHERE user_id = $1
      `,
      [userId]
    );

    res.json({ success: true, message: "All notifications cleared." });
  } catch (error: any) {
    console.error("Clear notifications error:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default {
  getNotifications,
  markAllRead,
  deleteNotification,
  clearAll
};
