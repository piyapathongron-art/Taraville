import { createUserService, findUserBy, getAllusersService } from "../services/user.service.js"
import { registerSchemaByAdmin } from "../validators/schema.js"
import createError from "http-errors"

export async function getAllUser(req,res,next) {
    const result = await getAllusersService()
    res.json(result)
}
export async function createUser(req,res,next) {
    //valify data
    const data = await registerSchemaByAdmin.parseAsync(req.body)
    //create + check existing
    const result = await createUserService(data)
    res.json({status: Boolean(result),
        message: "create user success",
        userId: result.userId
    })
}

export async function getUserById(req,res,next){
    //check id
    const id = +req.params.id
    if(!Number(id)){throw createError(400,"not an Id")}
    //chcek user
    const user = await findUserBy("userId",id)
    if(!user) {throw createError(404,"user not found")}
    res.json(user)
}