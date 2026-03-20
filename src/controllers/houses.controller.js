import { addHousesService, deleteHouseService, editHouseService, findHousesBy, getAllHousesService } from "../services/houses.service.js";
import createError from "http-errors";

export async function getAllHouse(req, res, next) {
    const result = await getAllHousesService()
    res.json(result)
}

export async function getHouseById(req,res,next){
    const id = +req.params.id
    //check params
    if(!Number(id)) throw createError(400,"houseId is not a Number")
    //find house by houseId
    const result = await findHousesBy("houseId",id)
    if(!result) throw createError(404,"house not found")
    res.json({result})
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

export async function editHouse(req,res,next) {
    const id = +req.params.id;
    const data = req.body
    //check params + body
    if(!Number(id)) throw createError(400, "code is not a Number")
    if(!data) throw createError(400,"body required")
    //validation

    //edit house
    const result = await editHouseService(id,data)
    res.json({
        status:Boolean(result),
        message:"edit house success",
        newHouseDetail: result
    })
    
}

export async function deleteHouse(req,res,next) {
    const id = +req.params.id
    //check id
    if(!Number(id)) throw createError(400, "houseId is not a Number")
    //delete house
    const result = await deleteHouseService(id)
    res.json({success:Boolean(result),
            message:"House Deleted",
            deleteHouse: {
                id: result.houseId,
                code: result.houseCode
            }
    })
}