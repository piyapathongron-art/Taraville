import express from "express";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { createSurvey, deleteSurvey, editSurvey, getAllSurvey, getSurveyById } from "../controllers/survey.controller.js";

const router = express.Router()

router.post("/",createSurvey)
router.use(authenMiddleware)
router.get("/",getAllSurvey)
router.get("/:id",getSurveyById)
router.put("/:id",editSurvey)
router.delete("/:id",deleteSurvey)

export default router