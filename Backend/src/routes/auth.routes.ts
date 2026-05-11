<<<<<<< HEAD
import { Express } from "express";
import { Router } from "express";
import authController from "../controller/auth.controller"

const router = Router();


router.post("/user/register",authController.RegisterUser);
router.post("/user/login", authController.LoginUser);

export default router;


=======
import express from 'express'
import { Router } from 'express'
 import authController from '../controller/auth.controller'
 const router = Router();

router.post("/user/register",authController.RegisterUser)
router.post("/user/login",authController.LoginUser)

export default router;
>>>>>>> d9ceb8d8361590b6fb9d86011619cfb5f579a362
