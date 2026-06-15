// import express  from 'express'
import { Router } from 'express'
import authController from '../controller/auth.controller'
import resumeController from '../controller/resume.controller'
import authMiddleware from '../middleware/auth.middleware'
import multer from 'multer'

const router = Router();

const upload = multer({
  storage: multer.memoryStorage()
});


//  api auth
router.post("/user/register",authController.RegisterUser)
router.post("/user/login",authController.LoginUser)


router.get("/my-resumes", authMiddleware, resumeController.getMyResumes);
router.get("/my-resume/:id", authMiddleware, resumeController.getResumeById);
router.post("/save-resume", authMiddleware, resumeController.createResume)
router.post("/improve-resume", authMiddleware, upload.single("resume"), resumeController.improveResume)
export default router;
