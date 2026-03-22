import { createUserService, findUserBy, getAllusersService } from "../services/user.service.js"
import { registerSchemaAdmin } from "../validators/schema.js"
import createError from "http-errors"

export async function getAllUser(req,res,next) {
    const result = await getAllusersService()
    res.json({totalUser:result.length,
        result
    })
}
export async function createUser(req,res,next) {
    //check body
    if(!req.body) throw createError(400,"required body")
    //valify data
    const data = await registerSchemaAdmin.parseAsync(req.body)
    //create + check existing
    const result = await createUserService(data)
    res.json({status: Boolean(result),
        message: "create user success",
        userId: result.userId
    })
}


// why u here
export async function getUserById(req,res,next){
    //check id
    const id = req.params.id
    //chcek user
    const user = await findUserBy("userId",id)
    if(!user) {throw createError(404,"user not found")}
    res.json(user)
}