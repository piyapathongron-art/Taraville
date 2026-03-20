import createError from "http-errors"
import { createAssignmentService, findAssignmentBy, getAllAssignmentService, getMyAssignmentService } from "../services/assignment.service.js"

export async function getAllAssignment(req,res,next){
    const result = await getAllAssignmentService()
    res.json({totalAssignment:result.length,result})
}

export async function getAssignmentByid(req,res,next){
    const id = +req.params.id
    if(!Number(id))next()
    const result = await findAssignmentBy("assignmentId",id)
    res.json(result)
}

export async function createAssignment(req,res,next) {
    const data = req.body
    //check data
    if(!data) throw createError(400,"body required")
    //validator

    // create assignment
    const result = await createAssignmentService(data)
    res.json({success: Boolean(result),
        message:"assignment created",
        assignment:{id:result.assignmentId, houseId:result.houseId, empId: result.empId, task: result.taskTitle}
    })
}

export async function findMyAssignment(req,res,next) {
    const empId = +req.user.empId
    if(!empId)throw createError(401,"token invalid")
    const result = await getMyAssignmentService(empId)
    res.json({employeeId: empId,
        totalAssignment: !result ? 0 : result.length,
        assignment: result
    })
}