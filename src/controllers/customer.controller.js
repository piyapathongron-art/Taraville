import { addCustomer, deleteCustomerService, editCustomerService, getAllCustomerService, getCustomerBy } from "../services/customer.service.js";
import createError from "http-errors"
export async function getAllCustomer(req, res, next) {
    const result = await getAllCustomerService()
    res.json({
        totalCustomer: result.length,
        result
    })
}

export async function getCustomerById(req, res, next) {
    const id = +req.params.id
    //check customer
    if (!Number(id)) createError(400, "Customer id is not Number")
    //find + check customer
    const result = await getCustomerBy("customerId", id)
    if(!result) createError(404, "user not found")
    res.json(result)
}

export async function createCustomer(req,res,next) {
    const data = req.body
    //check body null
    if(!data) throw createError(400,"required data")
    //validator

    //create
    const result = await addCustomer(data)
    res.json({success:Boolean(result),
        message: "create customer success",
        customer: {
            Id: result.customerId,
            firstname : result.firstName,
            phone: result.phone
        }
    })
}

export async function editCustomer(req,res,next) {
    const id = +req.params.id;
    //check id params
    if(!Number(id)) throw createError(400,"customer id is not number")
    const data = req.body;
    //check req.body
    if(!data)throw createError(400,"required data")
    //edit / check customer
    const result = await editCustomerService(id,data)
    res.json({success:Boolean(result),
        message:"edit customer complete",
        newCustomerDetail: result
    })
}

export async function deleteCustomer(req,res,next) {
    const id = +req.params.id
    //check id params
    if(!Number(id))throw createError(400,"cusomter id is not a number")
    //delete customer
    const result = await deleteCustomerService(id)
    res.json({success:Boolean(result),
        message:"delete success",
        customer:{Id: result.customerId, firstname: result.firstName}
    })

}