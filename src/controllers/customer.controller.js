import { addCustomer, deleteCustomerService, editCustomerService, getAllCustomerService, getCustomerBy } from "../services/customer.service.js";
import createError from "http-errors"
import { createCustomerSchema, updateCustomerSchema } from "../validators/schema.js";
export async function getAllCustomer(req, res, next) {
    const result = await getAllCustomerService()
    res.json({
        totalCustomer: result.length,
        result
    })
}

export async function getCustomerById(req, res, next) {
    //check id by params middlewares
    const id = req.params.id
    //find + check customer
    const result = await getCustomerBy("customerId", id)
    if(!result) createError(404, "user not found")

    res.json(result)
}

export async function createCustomer(req,res,next) {
    //validator
    const data = await createCustomerSchema.parseAsync(req.body)
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
    //check id by params middlewares
    const id = req.params.id;
    //validator
    const data = await updateCustomerSchema.parseAsync(req.body)
    //edit / check customer
    const result = await editCustomerService(id,data)
    res.json({success:Boolean(result),
        message:"edit customer complete",
        newCustomerDetail: result
    })
}

export async function deleteCustomer(req,res,next) {
    //check id by params middleware
    const id = req.params.id
    //delete customer
    const result = await deleteCustomerService(id)
    res.json({success:Boolean(result),
        message:"delete success",
        customer:{Id: result.customerId, firstname: result.firstName}
    })

}