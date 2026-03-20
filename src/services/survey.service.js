import { prisma } from "../lib/prisma.js";
import createError from "http-errors";
import { getCustomerBy } from "./customer.service.js";

export async function getAllSurveyService() {
    const result = await prisma.projectSurvey.findMany({ where: { deletedAt: null } })
    return result
}

export async function getSurveyBy(col, val) {
    const result = await prisma.projectSurvey.findFirst({ where: { [col]: val, deletedAt: null } })
    return result
}

export async function addSurvey(data) {
    //checkcustomerid
    const checkCustomer = await getCustomerBy("customerId", +data.customerId)
    if (!checkCustomer) throw createError(404, "check customer detail")
    //create projectSurvey
    const result = await prisma.projectSurvey.create({
        data: {
            customerId: +data.customerId,
            userId: +data.userId
        }
    })
    return result
}

export async function editSurveyService(id, data) {
    //check for existing survey
    const checkSurvey = await getSurveyBy("surveyId", id)
    if (!checkSurvey) throw createError(404, "Survey not found")
    //edit Survey
    const result = await prisma.projectSurvey.update({
        where: { surveyId: id },
        data:
            data

    })
    return result
}
export async function deleteSurveyService(id) {
    //check survey exist
    const checkSurvey = await getSurveyBy("surveyId", id)
    if (!checkSurvey) throw createError(404, "survey not found")
    //soft delete
    const now = new Date;
    const result = await prisma.projectSurvey.update({ where: { surveyId: id }, data: { deletedAt: now } })
    return result
}