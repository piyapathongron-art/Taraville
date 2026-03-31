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

export async function findHousesBySearch(search, type, status, page, limit) {
    const whereCondition = {
        deletedAt: null,
        ...(search ? {
            OR: [
                { houseName: { contains: search } },
                { houseCode: { contains: search } }
            ]
        } : {}),
        ...(type ? { houseType: type } : {}),
        ...(status ? { status: status } : {})
    };
    const [totalFiltered, result] = await prisma.$transaction([
        // นำcount ไปทำเลขหน้า
        prisma.house.count({
            where: whereCondition
        }),
        // ดึงข้อมูลจริงแบบจำกัดจำนวน limit
        prisma.house.findMany({
            where: whereCondition,
            include: {
                images: true
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' } 
        })
    ]);
    return {
        total: totalFiltered,
        houses: result
    };
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
    const checkHouseCode = await findHousesBy("houseCode",data.houseCode)
    if(checkHouseCode && checkHouseCode.houseId !== id ) throw createError(409,"this house code already exist")
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

export async function updateHouseImagesService(houseId, imageUrls) {
    // 1. เช็คก่อนว่าบ้านมีอยู่จริงไหม
    const checkHouse = await prisma.house.findFirst({ 
        where: { houseId: houseId, deletedAt: null } 
    });
    if (!checkHouse) throw createError(404, "House not found");

    // 2. ลบรูปเก่า "ทั้งหมด" ของบ้านหลังนี้ทิ้ง (เฉพาะในตาราง HouseImage)
    await prisma.houseImage.deleteMany({
        where: { houseId: houseId }
    });

    // 3. ถ้า Frontend ไม่ได้ส่งรูปมาเลย (ลบเกลี้ยง) ก็จบการทำงานแค่นี้
    if (!imageUrls || imageUrls.length === 0) {
        return [];
    }

    // 4. จัดรูปแบบ Array ให้ตรงกับ Schema ของฐานข้อมูล
    const payload = imageUrls.map(url => ({
        houseId: houseId,
        imageUrl: url,
        isCover: false // ให้รูปแรกเป็นปก (isCover: true) ก็ปรับตรงนี้ได้ครับ
    }));

    // 5. ใช้ createMany บันทึกรูปล็อตใหม่เข้าไป
    await prisma.houseImage.createMany({ 
        data: payload 
    });

    return payload;
}