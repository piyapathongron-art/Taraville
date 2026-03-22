import express from "express"
import { createUser, getAllUser, getUserById } from "../controllers/user.controller.js"
import authenMiddleware from "../middlewares/authen.middleware.js"
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js"
import paramsValidator from "../middlewares/paramsValidator.middleware.js"

const router = express.Router()

router.use(authenMiddleware)
router.use(adminAuthen)

router.get("/",getAllUser)
router.post("/",createUser)
router.get("/:id", paramsValidator,getUserById)

export default router