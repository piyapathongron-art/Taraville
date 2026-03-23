import express from "express";
import { addHouse, addHouseImage, deleteHouse, deleteHouseImage, editHouse, getAllHouse, getHouseById } from "../controllers/houses.controller.js";
import authenMiddleware from "../middlewares/authen.middleware.js";
import { adminAuthen } from "../middlewares/roleAuthen.middleware.js"
import paramsValidator from "../middlewares/paramsValidator.middleware.js";

const router = express.Router()

router.use(authenMiddleware)
router.get("/",getAllHouse)
router.get("/:id", paramsValidator ,getHouseById)

//these path use Admin role
router.use(adminAuthen)
router.post("/",addHouse)
router.put("/:id", paramsValidator,editHouse)
router.delete("/:id",paramsValidator,deleteHouse)
router.post("/:id/images", paramsValidator,addHouseImage)
router.delete("/:id/images/:imageId",paramsValidator,deleteHouseImage)

export default router