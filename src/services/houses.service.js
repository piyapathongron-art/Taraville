import { prisma } from "../lib/prisma.js";
import createError from "http-errors";

const now = new Date

export async function getAllHousesService() {
    const result = await prisma.house.findMany({
        include:{
            images:{}
        },
        where:{deletedAt:null}
    })
    return result
}

export async function findHousesBy(col, val) {
    const result = await prisma.house.findFirst({ where: { [col]: val, deletedAt: null },
    include:{
        images:{}
    } })
    return result
}

export async function addHousesService(data) {
    //check exist
    const check = await findHousesBy("houseCode", data.houseCode)
    if (check) throw createError(409, "house already exist")
    //craete house
    const result = await prisma.house.create({ data: data })
    return result
}

export async function editHouseService(id, data) {
    //check exist
    const check = await findHousesBy("houseId", id)
    if (!check) throw createError(404, "house not found")
    //edit house
    return await prisma.house.update({ where: { houseId: id }, data: data })
}

export async function deleteHouseService(id) {
    //check exist
    const checkHouse = await findHousesBy("houseId", id)
    if (!checkHouse) throw createError(404, "house not found")
    //soft delete house
    return await prisma.house.update({ where: { houseId: id }, data: { deletedAt: now } })
}

export async function addHouseImageService(id, url) {
    //check exist
    const checkHouse = await findHousesBy("houseId", id)
    if (!checkHouse) throw createError(404, "house not found")
    //add image
    return await prisma.houseImage.create({ data: { houseId: id, imageUrl: url.imageUrl, isCover: url.isCover } })
}

export async function deleteHouseImageService(houseId, imageId) {
    //check exist
    const checkHouse = await findHousesBy("houseId", houseId)
    if (!checkHouse) throw createError(404, "house not found")
    const checkImage = await prisma.houseImage.findFirst({ where: { imageId } })
    if (!checkImage) throw createError(404, "image not found")
    //soft delete
    return await prisma.houseImage.delete({ where: { imageId } })
}