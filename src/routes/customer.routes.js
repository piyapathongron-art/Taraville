import express from "express";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { createCustomer, deleteCustomer, editCustomer, getAllCustomer, getCustomerById, getCustomerBySearch } from "../controllers/customer.controller.js";
import paramsValidator from "../middlewares/paramsValidator.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js";

const router = express.Router()

router.post("/",createCustomer)
router.put("/:id",paramsValidator,editCustomer)
router.use(authenMiddleware)
router.use(adminAuthen)
router.get("/search",getCustomerBySearch)
router.get("/",getAllCustomer)
router.get("/:id",paramsValidator,getCustomerById)
router.delete("/:id",paramsValidator,deleteCustomer)

export default router