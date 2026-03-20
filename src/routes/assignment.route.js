import express from "express";
import { createAssignment, deleteAssignment, editAssignment, findMyAssignment, getAllAssignment, getAssignmentByid } from "../controllers/assignment.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";

const router = express.Router()

router.use(authenMiddleware)
router.get("/", getAllAssignment)
router.get("/me",findMyAssignment)
router.post("/", createAssignment)
router.put("/:id", editAssignment)
router.get("/:id", getAssignmentByid)
router.delete("/:id",deleteAssignment)

export default router