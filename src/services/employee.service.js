import { prisma } from "../lib/prisma.js";
import createHttpError from "http-errors";

export async function allEmployee() {
    const result = prisma.employee.findMany({
        where:
        {
            deletedAt:
                null
        }
    }
    )
    return result
}

export async function getEmployeeByIdService(id) {
    const result = prisma.employee.findUnique({ where: { employeeId: id,
        deletedAt : null
     } })
    return result
}

export async function createEmployees(data) {
    const result = await prisma.employee.create({ data: data })
    return result
}

export async function editEmployeesService(id, data) {
    //check existing
    const emp = await getEmployeeByIdService(id)
    
    if (!emp) { throw createHttpError(404, "employee not found") }
    
    //edit
    const result = await prisma.employee.update({
        where: { employeeId: id },
        data: data
    });
    return result
}

export async function deleteEmployeeService(id){
    //check Exist
    const emp = await getEmployeeByIdService(id)
    if(!emp) throw createHttpError(404,"employee not found")
        //delete
    const now = new Date()
    return prisma.employee.update(
        {where:
        {employeeId:id},
        data:{deletedAt: now}
    })
}