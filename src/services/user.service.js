import { prisma } from "../lib/prisma.js";
import createError from "http-errors"
import { getEmployeeByIdService } from "./employee.service.js";

export async function getAllusersService() {
    const result = prisma.user.findMany({
        where:
        {
            deletedAt: null
        },
        select:{ 
            userId: true,
            empId: true,
            role: true,
            createdAt: true
        }
    })
    return result
}

export async function createUserService(data){
    //check user existance
    const user = await findUserBy("empId",data.empId)
    if(user){throw createError(404,"user existing")}
    //check emp existance
    const empCheck = await getEmployeeByIdService(data.empId)
    if(!empCheck){throw createError(404,"employeeId not found")}
    //create user
    const result = await prisma.user.create({data:data})
    return result
}

export async function findUserBy(col,val){
    const result =  await prisma.user.findFirst({where:{[col]:val}})
    return result
}

