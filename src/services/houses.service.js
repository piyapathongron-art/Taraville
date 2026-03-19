import { prisma } from "../lib/prisma.js";


export async function getAllHousesService() {
    const result = await prisma.house.findMany({where:{deletedAt:null}})
    return result
}