import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export async function createUser(body) {
    //check empCheck
    await getEmployee(body.empId)
//create User
    const result = await prisma.user.create({ data: 
        body
     })
    return result
}

export async function getUserBy(table, value) {
    const result = await prisma.user.findUnique({ where: { [table]: value } })
    return result
}

export async function loginUser(body){
    //check existing user
    const user = await getUserBy("empId", +body.empId)
    if(!user){throw createHttpError(404, "user not found")}
    //check password
    const pwCheck = bcrypt.compareSync(body.password, user.password)
    if(!pwCheck){throw createHttpError(400, "password mismatch")}
    return user
}

export async function getEmployee(empId){
    //get employee data
    const data = await prisma.employee.findUnique({where:{employeeId:empId}})
    if(!data){throw createHttpError(404,"employee not found")}
    // console.log(data)
    return data
}