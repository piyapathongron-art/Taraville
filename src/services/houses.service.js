import { prisma } from "../lib/prisma.js";
import createError from "http-errors";


export async function getAllHousesService() {
    const result = await prisma.house.findMany({ where: { deletedAt: null } })
    return result
}

export async function findHousesBy(col, val) {
    return await prisma.house.findFirst({ where: { [col]: val } })
}

export async function addHousesService(data) {
    //check exist
    const check = await findHousesBy("houseCode",data.houseCode)
    if(check) throw createError(409,"house already exist")
    //craete house
    const result = await prisma.house.create({data:data})
    return result
}