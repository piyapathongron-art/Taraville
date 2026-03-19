import express from "express";
import { getMe, loginController, registerController } from "../controllers/auth.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js";

const router = express.Router()

router.post("/register",registerController)
router.post("/login",loginController)
router.get("/me",authenMiddleware,getMe)

export default router

