import express from "express";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { createSurvey, deleteSurvey, editSurvey, getAllSurvey, getSurveyById } from "../controllers/survey.controller.js";
import paramsValidator from "../middlewares/paramsValidator.middleware.js";

const router = express.Router()

router.post("/",createSurvey)
router.use(authenMiddleware)
router.get("/",getAllSurvey)
router.get("/:id",paramsValidator,getSurveyById)
router.put("/:id",paramsValidator,editSurvey)
router.delete("/:id",paramsValidator,deleteSurvey)

export default router