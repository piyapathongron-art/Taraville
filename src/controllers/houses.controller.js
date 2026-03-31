import { addHouseImageService, addHousesService, deleteHouseImageService, deleteHouseService, editHouseService, findHousesBy, findHousesBySearch, getAllHousesService, updateHouseImagesService } from "../services/houses.service.js";
import createError from "http-errors";
import { createHouseSchema, houseImageSchema, updateHouseImagesSchema, updateHouseSchema } from "../validators/schema.js";

export async function getAllHouse(req, res, next) {
    const result = await getAllHousesService()
    res.json({
        totalHouse: result.length,
        result
    })
}

export async function getHousesBySearch(req, res, next) {
    try {
        const { search, type, status, page = 1, limit = 8 } = req.query;
        
        const result = await findHousesBySearch(search, type, status, parseInt(page), parseInt(limit));
        
        res.json({ 
            totalHouse: result.total, 
            houses: { 
                total: result.houses.length, 
                result: result.houses       
            } 
        });
    } catch (error) {
        next(error);
    }
}

export async function getHouseById(req, res, next) {
    const id = req.params.id
    //check params
    //find house by houseId
    const result = await findHousesBy("houseId", id)
    if (!result) throw createError(404, "house not found")
    res.json({ result })
}

export async function addHouse(req, res, next) {
    //validate
    const data = await createHouseSchema.parseAsync(req.body)
    //create house
    const result = await addHousesService(data)

    res.json({
        status: Boolean(result),
        message: "Add house success",
        house: result
    })
}

export async function editHouse(req, res, next) {
    const id = req.params.id;
    //validation
    const data = await updateHouseSchema.parseAsync(req.body)
    //edit house
    const result = await editHouseService(id, data)
    res.json({
        status: Boolean(result),
        message: "edit house success",
        newHouseDetail: result
    })

}

export async function deleteHouse(req, res, next) {
    const id = req.params.id
    //delete house
    const result = await deleteHouseService(id)
    res.json({
        success: Boolean(result),
        message: "House Deleted",
        deleteHouse: {
            id: result.houseId,
            code: result.houseCode
        }
    })
}

export async function addHouseImage(req, res, next) {
    //check params by middlewares
    const id = req.params.id
    //validator image
    const url = await houseImageSchema.parseAsync(req.body)
    //upload image
    const result = await addHouseImageService(id, url)
    res.json({
        success: Boolean(result),
        message: "upload image success",
        imageId: result.imageId
    })
}

export async function deleteHouseImage(req, res, next) {
    //check params by middlewares
    const houseId = req.params.id
    const imageId = req.params.imageId
    //delete
    const result = await deleteHouseImageService(houseId, imageId)
    res.json({
        success: Boolean(result),
        message: "image deleted",
        imageId: result.imageId,
        houseId: result.houseId
    })

}

export async function updateHouseImages(req, res, next) {
    try {
        const id = req.params.id

        const data = await updateHouseImagesSchema.parseAsync(req.body);

        const result = await updateHouseImagesService(id, data.images);

        res.json({
            success: true,
            message: "อัปเดตรูปภาพบ้านสำเร็จ",
            count: result
        });
    } catch (error) {
        next(error);
    }
}