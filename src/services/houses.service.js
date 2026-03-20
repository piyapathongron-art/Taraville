import { prisma } from "../lib/prisma.js";
import createError from "http-errors";

const now = new Date

export async function getAllHousesService() {
    const result = await prisma.house.findMany({ where: { deletedAt: null } })
    return result
}

export async function findHousesBy(col, val) {

    const result = await prisma.house.findFirst({ where: { [col]: val , deletedAt:null } })
    return result
}

export async function addHousesService(data) {
    //check exist
    const check = await findHousesBy("houseCode",data.houseCode)
    if(check) throw createError(409,"house already exist")
    //craete house
    const result = await prisma.house.create({data:data})
    return result
}

export async function editHouseService(id,data) {
    //check exist
    const check = await findHousesBy("houseId",id)
    if(!check) throw createError(404,"house not found")
    //edit house
    return await prisma.house.update({where:{houseId:id}, data:data})
}

export async function deleteHouseService(id) {
    //check exist
    const check = await findHousesBy("houseId",id)
    if(!check) throw createError(404,"house not found")
    //soft delete house
    return await prisma.house.update({where:{houseId:id},data:{deletedAt: now}})
}

