import { allEmployee, createEmployees, deleteEmployeeService, editEmployeesService, getEmployeeByIdService } from "../services/employee.service.js";
import createHttpError from "http-errors"


export async function getAllEmployee(req,res,next){
    //get all employee
    const result = await allEmployee()
    // console.log(allEmp)
    res.json({totalEmployee:result.length,
        result
    })
}

export async function getEmployeeById(req,res,next){
    //check params
    const id = +req.params.id 
    if(!Number(id)){throw createHttpError(400,"not an Id")}
    //get emp by id
    const result = await getEmployeeByIdService(id)
    if(!result){throw createHttpError(404,"employee not found")}

    res.json(result)
}

export async function createEmployeeController(req,res,next) {
    //check body
    const data = req.body
    if(!data){throw createHttpError(400,"required data")}
    // console.log(data)

    //create emp
    const result = await createEmployees(data)
    res.json({
        status:Boolean(result),
        message: "Create Employee Success",
        employeeId: result.employeeId
    })
}

export async function editEmployee(req,res,next) {
    const data = req.body
    const id = +req.params.id
    //check id and data
    if(!Number(id)) throw createHttpError(400,"employee id is not a number")
    // console.log(id)
    if(!data){throw createHttpError(400,"required data")}
    //edit 
    const result = await editEmployeesService(id,data)
    res.json({
        status:Boolean(result),
        message:"edit success",
        employeeId: result.employeeId,
        newData: data
    })
}

export async function deleteEmployee(req,res,next){
    const id = +req.params.id
    //check id
    if(!Number(id)) throw createHttpError(400,"employee id is not a number")
    const result = await deleteEmployeeService(id)
    res.json({status: Boolean(result),
        message:"Delete Success",
        employeeId: result.employeeId
    })
}