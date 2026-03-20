import { addCustomer, getAllCustomerService, getCustomerBy } from "../services/customer.service.js";
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