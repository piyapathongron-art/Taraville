import express from "express";
import { createEmployeeController, deleteEmployee, editEmployee, getAllEmployee, getEmployeeById } from "../controllers/employees.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js";

const router = express.Router()

router.use(authenMiddleware)
router.use(adminAuthen)

router.get("/",getAllEmployee)
router.post("/",createEmployeeController)
router.get("/:id",getEmployeeById)
router.put("/:id",editEmployee)
router.delete("/:id",deleteEmployee)

export default router

