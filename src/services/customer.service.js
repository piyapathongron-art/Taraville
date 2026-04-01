import { prisma } from "../lib/prisma.js";
import createError from "http-errors";

export async function getAllCustomerService() {
    const result = await prisma.customer.findMany({ where: { deletedAt: null, projectSurveys:{} },include:{projectSurveys:true} })
    return result
}

export async function getCustomerBy(col, val) {
    const result = await prisma.customer.findFirst({ where: { [col]: val, deletedAt: null } })
    return result
}

export async function getCustomerBySeachService(search, type,house,budget ,page, limit) {
    const whereCondition = {
        deletedAt: null,
        ...(search ? {
            OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { phone: { contains: search } }
            ]
        } : {}),
        ...(type ? { projectSurveys:{ surveyType:type } } : {}),
        ...(house ? { projectSurveys:{ interestedPropertyType:house } } : {}),
        ...(budget ? { projectSurveys:{ budgetRange:budget } } : {})
    };
    const [totalFiltered, result] = await prisma.$transaction([
        // นำcount ไปทำเลขหน้า
        prisma.customer.count({
            where: whereCondition
        }),
        // ดึงข้อมูลจริงแบบจำกัดจำนวน limit
        prisma.customer.findMany({
            where: whereCondition,
            include:{projectSurveys:true},
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { customerId: 'asc' } 
        })
    ]);
    return {
        total: totalFiltered,
        customers: result
    };
}

export async function addCustomer(data) {
    const check = await getCustomerBy("phone", data.phone)
    //check customer by phone
    if (check) throw createError(409, "phone number have been used")
    //create customer
    const result = await prisma.customer.create({ data: data })
    return result
}

export async function editCustomerService(id, data) {
    //check customer
    const check = await getCustomerBy("customerId", id)
    if (!check) throw createError(404, "customer not found");
    //edit
    const result = await prisma.customer.update({ where: { customerId: id }, data: data })
    return result
}

export async function deleteCustomerService(id) {
    //check customer exist
    const check = await getCustomerBy("customerId", id)
    if (!check) throw createError(404, "customer not found")
    //soft delete
    const now = new Date;
    const result = await prisma.customer.update({ where: { customerId: id }, data: { deletedAt:now } })
    return result
}