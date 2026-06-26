import { Router } from "express";
import resumeController from "../controller/resume.controller";
import authMiddleware from "../middleware/auth.middleware";
import multer from "multer";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage()
});

router.get("/", authMiddleware, resumeController.getMyResumes);
router.get("/:id", authMiddleware, resumeController.getResumeById);
router.post("/", authMiddleware, resumeController.createResume);
router.put("/:id", authMiddleware, resumeController.updateResume);
router.delete("/:id", authMiddleware, resumeController.deleteResume);
router.post("/:id/duplicate", authMiddleware, resumeController.duplicateResume);
router.patch("/:id/rename", authMiddleware, resumeController.renameResume);
router.post("/:id/share", authMiddleware, resumeController.shareResume);
router.get("/share/:shareId", resumeController.getSharedResume); // Public
router.post("/:id/download", authMiddleware, resumeController.downloadResume);
router.patch("/:id/archive", authMiddleware, resumeController.toggleArchiveResume);
router.patch("/:id/favorite", authMiddleware, resumeController.toggleFavoriteResume);
router.get("/:id/versions", authMiddleware, resumeController.getResumeVersions);
router.post("/:id/versions/:versionId/restore", authMiddleware, resumeController.restoreResumeVersion);
router.post("/match", authMiddleware, resumeController.matchResume);
router.post("/improve", authMiddleware, upload.single("resume"), resumeController.improveResume);
router.post("/upload-parse", authMiddleware, upload.single("resume"), resumeController.uploadAndParseResume);
router.post("/extract-text", authMiddleware, upload.single("file"), resumeController.extractTextFromFile);

export default router;
