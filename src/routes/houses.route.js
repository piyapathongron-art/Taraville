import express from "express";
import { addHouse, getAllHouse } from "../controllers/houses.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";

const router = express.Router()

router.use(authenMiddleware)
router.get("/",getAllHouse)
router.post("/",addHouse)

export default router