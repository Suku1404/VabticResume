// import express  from 'express'
import { Router } from 'express'
import authController from '../controller/auth.controller'
import resumeController from '../controller/resume.controller'
 const router = Router();


//  api auth
router.post("/user/register",authController.RegisterUser)
router.post("/user/login",authController.LoginUser)


router.get("/my-resumes", resumeController.getMyResumes);
export default router;
