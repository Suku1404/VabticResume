import { Router } from "express";
import notificationController from "../controller/notification.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, notificationController.getNotifications);
router.patch("/read", authMiddleware, notificationController.markAllRead);
router.delete("/:id", authMiddleware, notificationController.deleteNotification);
router.delete("/", authMiddleware, notificationController.clearAll);

export default router;
