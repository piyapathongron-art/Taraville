import { prisma } from "../lib/prisma.js";
import createError from "http-errors";
import { getCustomerBy } from "./customer.service.js";

export async function getAllSurveyService() {
    const result = await prisma.projectSurvey.findMany({ where: { deletedAt: null }, include: { decisionFactors: { select: { decisionFactor: true } } } })
    return result
}

export async function getSurveyBy(col, val) {
    const result = await prisma.projectSurvey.findFirst({ where: { [col]: val, deletedAt: null }, include: { decisionFactors: { select: { decisionFactor: true } } } })
    return result
}

export async function addSurvey(data) {
    //checkcustomerid
    const checkCustomer = await getCustomerBy("customerId", +data.customerId)
    if (!checkCustomer) throw createError(404, "check customer detail")
    //create projectSurvey
    // seperate decisionFactors 
    const { decisionFactors, ...surveyData } = data;
    console.log(data)
    // Nested Writes
    const result = await prisma.projectSurvey.create({
        data: {
            ...surveyData,
            //if decisionFactor true create
            ...(decisionFactors && decisionFactors.length > 0 && {
                decisionFactors: {
                    create: decisionFactors.map((factor) => ({
                        decisionFactor: factor
                    }))
                }
            })
        },
        include: {
            decisionFactors: true
        }
    });

    return result;
}

export async function editSurveyService(id, data) {
    //check for existing survey
    const checkSurvey = await getSurveyBy("surveyId", id)
    if (!checkSurvey) throw createError(404, "Survey not found")
    //edit Survey
    const { decisionFactors, ...surveyData } = data;
    // console.log(data)
    const result = await prisma.projectSurvey.update({
        where: { surveyId: id },
        data: {
            ...surveyData,
            //check inside if !undefined = deleteMany then create
            ...(decisionFactors !== undefined && {
                decisionFactors: {
                    deleteMany: {},
                    create: decisionFactors.map((factor) => ({
                        decisionFactor: factor
                    }))
                }
            })
        },
        include: {
            decisionFactors: true
        }
    });
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