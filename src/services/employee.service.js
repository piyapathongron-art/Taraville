import { prisma } from "../lib/prisma.js";
import createHttpError from "http-errors";

export async function allEmployee() {
    const result = prisma.employee.findMany({
        where:
        {
            deletedAt:
                null
        },
        include: { user: { select: { userId: true } }, assignments: { where: { deletedAt: null } } }
    }
    )
    return result
}

export async function getEmployeeBySearchService(search, department, page, limit) {
    const whereCondition = {
        deletedAt: null,
        ...(search ? {
            OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { phone: { contains: search } }
            ]
        } : {}),
        ...(department ? { department: department } : {})
    };
    const [totalFiltered, result] = await prisma.$transaction([
        // นำcount ไปทำเลขหน้า
        prisma.employee.count({
            where: whereCondition
        }),
        // ดึงข้อมูลจริงแบบจำกัดจำนวน limit
        prisma.employee.findMany({
            where: whereCondition,
            include: { user: { select: { userId: true } }, assignments: { where: { deletedAt: null } } },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    ]);
    return {
        total: totalFiltered,
        employees: result
    };
}

export async function getEmployeeByIdService(id) {
    console.log(id)
    const result = prisma.employee.findUnique({
        where: {
            employeeId: id,
            deletedAt: null
        }
    })
    return result
}

export async function getEmployeeBy(col, val) {
    const result = prisma.employee.findFirst({ where: { [col]: val } })
    return result
}

export async function createEmployees(data) {
    //check phone // no need to be real email
    const check = await getEmployeeBy("phone", data.phone)
    if (check) throw createHttpError(409, "employee or phone already exist")
    //create
    const result = await prisma.employee.create({ data: data })
    return result
}

export async function editEmployeesService(id, data) {
    //check existing
    const employee = await getEmployeeByIdService(id)

    if (!employee) { throw createHttpError(404, "employee not found") }

    //edit
    const result = await prisma.employee.update({
        where: { employeeId: id },
        data: data
    });
    return result
}

export async function deleteEmployeeService(id) {
    //check Exist
    const emp = await getEmployeeByIdService(id)
    if (!emp) throw createHttpError(404, "employee not found")
    //delete
    const now = new Date()
    return prisma.employee.update(
        {
            where:
                { employeeId: id },
            data: { deletedAt: now }
        })
}

export async function editEmployeesByUserService(id, data) {
    //check existing
    const employee = await getEmployeeByIdService(id)

    if (!employee) { throw createHttpError(404, "employee not found") }
    if (id !== employee.employeeId) throw createHttpError(403, "forbidden to edit other employee")

    //edit
    const result = await prisma.employee.update({
        where: { employeeId: id },
        data: data
    })

    return result
}