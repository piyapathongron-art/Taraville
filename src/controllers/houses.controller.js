import { addHousesService, getAllHousesService } from "../services/houses.service.js";
import createError from "http-errors";

export async function getAllHouse(req, res, next) {
    const result = await getAllHousesService()
    res.json(result)
}

export async function addHouse(req, res, next) {
    //check body
    const data = req.body
    if (!data) throw createError(400, "required house infomation")
    //validate

    //create house
    const result = await addHousesService(data)

    res.json({
        status: Boolean(result),
        message: "Add house success",
        house:result
    })
}