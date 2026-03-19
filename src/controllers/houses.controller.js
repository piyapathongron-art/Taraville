import { getAllHousesService } from "../services/houses.service.js";

export async function getAllHouse(req,res,next) {
    const result = await getAllHousesService()
    res.json(result)
}