import express from "express";
import { createEmployeeController, deleteEmployee, editEmployee, editEmployeeByUser, getAllEmployee, getEmployeeById } from "../controllers/employees.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js";
import paramsValidator from "../middlewares/paramsValidator.middleware.js";

const router = express.Router()

router.use(authenMiddleware)

router.get("/",adminAuthen,getAllEmployee)
router.post("/",adminAuthen,createEmployeeController)
router.get("/:id",adminAuthen,paramsValidator,getEmployeeById)
router.put("/:id",adminAuthen,paramsValidator,editEmployee)
router.put("/editByUser/:id",paramsValidator,editEmployeeByUser)
router.delete("/:id",adminAuthen,paramsValidator,deleteEmployee)

export default router

