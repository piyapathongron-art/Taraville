import express from "express";
import { getAllHouse } from "../controllers/houses.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";

const router = express.Router()

router.use(authenMiddleware)
router.get("/",getAllHouse)

export default router