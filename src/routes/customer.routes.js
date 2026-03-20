import express from "express";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { createCustomer, editCustomer, getAllCustomer, getCustomerById } from "../controllers/customer.controller.js";

const router = express.Router()

router.use(authenMiddleware)

router.get("/",getAllCustomer)
router.get("/:id",getCustomerById)
router.post("/",createCustomer)
router.put("/:id",editCustomer)

export default router