// import express  from 'express'
import { Router } from 'express'
import authController from '../controller/auth.controller'
 const router = Router();

router.post("/user/register",authController.RegisterUser)
router.post("/user/login",authController.LoginUser)

export default router;
