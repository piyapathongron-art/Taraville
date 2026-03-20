import express from "express";
import { addHouse, deleteHouse, editHouse, getAllHouse, getHouseById } from "../controllers/houses.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js"

const router = express.Router()

router.use(authenMiddleware)
router.get("/",getAllHouse)
router.get("/:id",getHouseById)

//these path use Admin role
router.use(adminAuthen)
router.post("/",addHouse)
router.put("/:id",editHouse)
router.delete("/:id",deleteHouse)

export default router