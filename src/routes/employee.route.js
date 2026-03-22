import express from "express";
import { createEmployeeController, deleteEmployee, editEmployee, getAllEmployee, getEmployeeById } from "../controllers/employees.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js";
import paramsValidator from "../middlewares/paramsValidator.middleware.js";

const router = express.Router()

router.use(authenMiddleware)
router.use(adminAuthen)

router.get("/",getAllEmployee)
router.post("/",createEmployeeController)
router.get("/:id", paramsValidator,getEmployeeById)
router.put("/:id",paramsValidator,editEmployee)
router.delete("/:id",paramsValidator,deleteEmployee)

export default router

