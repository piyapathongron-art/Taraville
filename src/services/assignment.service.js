import { prisma } from "../lib/prisma.js";
import createError from "http-errors";
import { findHousesBy } from "./houses.service.js";
import { getEmployeeByIdService } from "./employee.service.js";

const now = new Date

export async function getAllAssignmentService() {
    const result = await prisma.assignment.findMany({ where: { deletedAt: null } })
    return result
}

export async function createAssignmentService(data) {


    //check house
    const checkHouse = await findHousesBy("houseId", +data.houseId)
    if (!checkHouse) throw createError(404, "house not found")
    //check emp
    const checkemp = await getEmployeeByIdService(+data.empId)
    if (!checkemp) throw createError(404, "employee not found")
    //create assignment
    const result = await prisma.assignment.create({
        data: {
            empId: +data.empId,
            houseId: +data.houseId,
            taskTitle: data.taskTitle,
            taskDescription: data.taskDescription,
            dutyRole: data.dutyRole,
            assignedDate: data.assignedDate,
            status: data.status
        }
    })
    return result
}

export async function findAssignmentBy(col, val) {
    const result = await prisma.assignment.findFirst({ where: { [col]: val, deletedAt: null } });
    if (!result) throw createError(404, "assignment not found")
    return result
}

export async function getMyAssignmentService(id) {
    const result = await prisma.assignment.findMany({ where: { empId: id } })
    return result
}

export async function editAssignmentService(id, data) {
    const checkId = await findAssignmentBy("assignmentId", id)
    //check id
    if (!checkId) throw createError(404, "assignment not found")
    //check house
    const checkHouse = await findHousesBy("houseId", +data.houseId)
    if (!checkHouse) throw createError(404, "house not found")
    //check emp
    const checkemp = await getEmployeeByIdService(+data.empId)
    if (!checkemp) throw createError(404, "employee not found")
    const result = await prisma.assignment.update({
        where: { assignmentId: id }, data: {
            empId: +data.empId,
            houseId: +data.houseId,
            taskTitle: data.taskTitle,
            taskDescription: data.taskDescription,
            dutyRole: data.dutyRole,
            assignedDate: data.assignedDate,
            status: data.status
        }
    })
    return result
}

export async function deleteAssignmentService(id){
    const now = new Date;
    const check = await findAssignmentBy("assignmentId",id)
    //check assignment
    if(!check) throw createError(404,"assignment not found")
    //delete assignment
    const result = await prisma.assignment.update({ where:{assignmentId:id},data:{deletedAt:now}})
    return result
}