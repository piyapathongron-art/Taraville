import { prisma } from "../lib/prisma.js";
import createError from "http-errors";
import { getCustomerBy } from "./customer.service.js";

export async function getAllSurveyService() {
    const result = await prisma.projectSurvey.findMany({where:{deletedAt:null}})
    return result
}

export async function getSurveyBy(col,val) {
    const result = await prisma.projectSurvey.findFirst({where:{[col]:val, deletedAt:null}})
    return result
}

export async function addSurvey(data) {
    //checkcustomerid
    const checkCustomer = await getCustomerBy("customerId",+data.customerId)
    if(!checkCustomer)throw createError(404,"check customer detail")
    //create projectSurvey
    const result = await prisma.projectSurvey.create({data:{
        customerId: +data.customerId,
        userId: +data.userId
    }})
    return result
}