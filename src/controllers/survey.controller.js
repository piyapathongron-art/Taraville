import { addSurvey, getAllSurveyService, getSurveyBy } from "../services/survey.service.js";
import createError from "http-errors";
export async function getAllSurvey(req,res,next) {
    const result = await getAllSurveyService()
    res.json({totalSurvey:result.length,
        result
    })
}

export async function getSurveyById(req,res,next) {
    const id = +req.params.id
    //check id params
    if(!Number(id))throw createError(400,"surveyid is not a number")
    //find survey by id params
    const result = await getSurveyBy("surveyId",id)
    if(!result) throw createError(404,"survey not found")
    res.json(result)
}

export async function createSurvey(req,res,next) {
    const data = req.body
    //check body
    if(!data) throw createError(400, "requierd body")
    //validator

    //create
    const result = await addSurvey(data)
    res.json({success:Boolean(result),
        message:"create survey success",
        survey:{Id:result.surveyId,
            customerId: result.customerId
        }
    })
}