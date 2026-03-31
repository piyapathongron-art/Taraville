import { allEmployee, createEmployees, deleteEmployeeService, editEmployeesService, getEmployeeByIdService } from "../services/employee.service.js";
import createHttpError from "http-errors"
import { createEmployeeSchema, updateEmployeeSchema } from "../validators/schema.js";


export async function getAllEmployee(req,res,next){
    //get all employee
    const result = await allEmployee()
    // console.log(allEmp)
    res.json({totalEmployee:result.length,
        result
    })
}

export async function getEmployeeById(req,res,next){
    //checked params by paramsvalidator
    const id = req.params.id
    //get emp by id
    const result = await getEmployeeByIdService(id)
    if(!result){throw createHttpError(404,"employee not found")}

    res.json(result)
}

export async function createEmployeeController(req,res,next) {
    //validator
    const data = await createEmployeeSchema.parseAsync(req.body)

    //create emp
    const result = await createEmployees(data)
    res.json({
        status:Boolean(result),
        message: "Create Employee Success",
        employeeId: result.employeeId
    })
}

export async function editEmployee(req,res,next) {

    //checked params by validator
    const id = req.params.id
    //validator
    const data = await updateEmployeeSchema.parseAsync(req.body)

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
    const id = req.params.id
    const result = await deleteEmployeeService(id)
    res.json({status: Boolean(result),
        message:"Delete Success",
        employeeId: result.employeeId
    })
}

export async function editEmployeeByUser(req,res,next){
    //checked params by validator
    const id = req.params.id
    //validator
    const data = await updateEmployeeSchema.parseAsync(req.body)

    //edit 
    const result = await editEmployeesService(id,data)
    res.json({
        status:Boolean(result),
        message:"edit success",
        employeeId: result.employeeId,
        newData: data
    })

}