import express from "express";
import { createAssignment, findMyAssignment, getAllAssignment, getAssignmentByid } from "../controllers/assignment.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";

const router = express.Router()

router.use(authenMiddleware)
router.get("/", getAllAssignment)
router.get("/me",findMyAssignment)
router.get("/:id", getAssignmentByid)
router.post("/", createAssignment)

export default router