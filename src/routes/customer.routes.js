import express from "express";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { createCustomer, deleteCustomer, editCustomer, getAllCustomer, getCustomerById } from "../controllers/customer.controller.js";
import paramsValidator from "../middlewares/paramsValidator.middleware.js";

const router = express.Router()

router.use(authenMiddleware)

router.get("/",getAllCustomer)
router.post("/",createCustomer)
router.get("/:id",paramsValidator,getCustomerById)
router.put("/:id",paramsValidator,editCustomer)
router.delete("/:id",paramsValidator,deleteCustomer)

export default router