import express from "express";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { createCustomer, deleteCustomer, editCustomer, getAllCustomer, getCustomerById } from "../controllers/customer.controller.js";

const router = express.Router()

router.use(authenMiddleware)

router.get("/",getAllCustomer)
router.post("/",createCustomer)
router.get("/:id",getCustomerById)
router.put("/:id",editCustomer)
router.delete("/:id",deleteCustomer)

export default router