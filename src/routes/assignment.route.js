import express from "express";
import { createAssignment, deleteAssignment, editAssignment, findMyAssignment, getAllAssignment, getAssignmentByid } from "../controllers/assignment.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";
import paramsValidator from "../middlewares/paramsValidator.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js";

const router = express.Router()


router.get("/", authenMiddleware,adminAuthen,getAllAssignment)
router.get("/me",authenMiddleware,findMyAssignment)
router.post("/", authenMiddleware,adminAuthen,createAssignment)
router.put("/:id", authenMiddleware,adminAuthen,paramsValidator,editAssignment)
router.get("/:id", authenMiddleware,adminAuthen,paramsValidator,getAssignmentByid)
router.delete("/:id",authenMiddleware,adminAuthen,paramsValidator,deleteAssignment)

export default router