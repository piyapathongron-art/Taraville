import { prisma } from "../lib/prisma.js";
import createError from "http-errors";

export async function getAllCustomerService() {
    const result = await prisma.customer.findMany({ where: { deletedAt: null } })
    return result
}

export async function getCustomerBy(col, val) {
    const result = await prisma.customer.findFirst({ where: { [col]: val, deletedAt: null } }) 
    return result
}

export async function addCustomer(data) {
    const check = await getCustomerBy("phone",data.phone)
    //check customer by phone
    if(check) throw createError(409, "phone number have been used")
    //create customer
    const result = await prisma.customer.create({data:data})
    return result
}