import express from "express";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { createCustomer, getAllCustomer, getCustomerById } from "../controllers/customer.controller.js";

const router = express.Router()

router.use(authenMiddleware)

router.get("/",getAllCustomer)
router.get("/:id",getCustomerById)
router.post("/",createCustomer)


export default router