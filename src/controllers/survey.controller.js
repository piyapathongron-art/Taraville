import { addSurvey, deleteSurveyService, editSurveyService, getAllSurveyService, getSurveyBy } from "../services/survey.service.js";
import createError from "http-errors";
import { createSurveySchema, updateSurveySchema } from "../validators/schema.js";
export async function getAllSurvey(req,res,next) {
    const result = await getAllSurveyService()
    res.json({totalSurvey:result.length,
        result
    })
}

export async function getSurveyById(req,res,next) {
    //check id by params middlewares
    const id = req.params.id
    //find survey by id params
    const result = await getSurveyBy("surveyId",id)
    if(!result) throw createError(404,"survey not found")
    res.json(result)
}

export async function createSurvey(req,res,next) {
    //validator
const data = await createSurveySchema.parseAsync(req.body)
    //create
    const result = await addSurvey(data)
    res.json({success:Boolean(result),
        message:"create survey success",
        survey:{Id:result.surveyId,
            customerId: result.customerId
        }
    })
}

export async function editSurvey(req,res,next) {
    //check id by params middlewares
    const id = req.params.id
    //validator
    const data = await updateSurveySchema.parseAsync(req.body)
    // console.log(data)
    //edit + check
    const result = await editSurveyService(id,data)
    res.json({success:Boolean(result),
        message:"edit survey success",
        newSurvay : result
    })
}

export async function deleteSurvey(req,res,next) {
    //check id by parmas middlewares
    const id = req.params.id
    //delete
    const result = await deleteSurveyService(id)
    res.json({success:Boolean(result),
        message:"delate Survey success",
        surveyId: result.surveyId
    })
}