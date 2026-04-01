import createError from "http-errors"
import { createAssignmentService, deleteAssignmentService, editAssignmentService, findAssignmentBy, getAllAssignmentService, getAssignmentBySearchService, getMyAssignmentService } from "../services/assignment.service.js"
import { createAssignmentSchema, updateAssignmentSchema } from "../validators/schema.js"

export async function getAllAssignment(req,res,next){
    const result = await getAllAssignmentService()
    res.json({totalAssignment:result.length,result})
}

export async function getAssignmentBySearch(req,res,next) {
    const { search, status, sortAssignedDate,page = 1, limit = 8 } = req.query
    const result = await getAssignmentBySearchService(search, status, sortAssignedDate, parseInt(page), parseInt(limit))
    res.json(result)
}

export async function getAssignmentByid(req,res,next){
    //checked by middlewares
    const id = req.params.id
    //getById
    const result = await findAssignmentBy("assignmentId",id)
    if(!result) throw createError(404,"assignment not found")
    res.json(result)
}

export async function createAssignment(req,res,next) {
    //validator
        const data = await createAssignmentSchema.parseAsync(req.body)
    // create assignment
    const result = await createAssignmentService(data)
    res.json({success: Boolean(result),
        message:"assignment created",
        assignment:{id:result.assignmentId, houseId:result.houseId, empId: result.empId, task: result.taskTitle}
    })
}

export async function findMyAssignment(req,res,next) {
    //check employeeId from token
    const empId = +req.user.empId
    if(!empId)throw createError(401,"token invalid")
    const result = await getMyAssignmentService(empId)
    res.json({employeeId: empId,
        totalAssignment: !result ? 0 : result.length,
        assignment: result
    })
}

export async function editAssignment(req,res,next) {
    //checked params by middlewares
    const id = req.params.id
    //validator
    const data = await updateAssignmentSchema.parseAsync(req.body)
    //edit assignment
    const result = await editAssignmentService(id,data)
    res.json({success: Boolean(result),
        message:"edit success",
        newAssignmentDetails: result
    })
}

export async function deleteAssignment(req,res,next) {
    //checked id by params middlewares
    const id = req.params.id
    //delete assignment
    const result = await deleteAssignmentService(id)
    res.json({success: Boolean(result),
        message:`assignment id:${result.assignmentId} deleted`
    })
}