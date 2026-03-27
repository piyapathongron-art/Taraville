import express from "express";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { createCustomer, deleteCustomer, editCustomer, getAllCustomer, getCustomerById } from "../controllers/customer.controller.js";
import paramsValidator from "../middlewares/paramsValidator.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js";

const router = express.Router()

router.post("/",createCustomer)
router.use(authenMiddleware)
router.use(adminAuthen)
router.put("/:id",paramsValidator,editCustomer)

router.get("/",getAllCustomer)
router.get("/:id",paramsValidator,getCustomerById)
router.delete("/:id",paramsValidator,deleteCustomer)

export default router