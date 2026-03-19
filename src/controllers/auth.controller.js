import { createUser, getEmployee, getUserBy, loginUser } from "../services/auth.service.js"
import { createToken } from "../utils/jwt.js"
import { loginSchema, registerSchema } from "../validators/schema.js"
import createError from "http-errors"

export async function registerController(req, res, next) {

    //validate register
    const data = await registerSchema.parseAsync(req.body)
    // console.log(data)

    //check existing user
    const check = await getUserBy("empId", data.empId)
    if (check) { throw createError(400, "existing user") }

    //create user
    const result = await createUser(data)

    res.json({
        status: Boolean(result),
        message: "register successful",
        userId: result.userId
    })

}

export async function loginController(req, res, next) {

    //validate login
    const data = await loginSchema.parseAsync(req.body)
    // console.log(data)

    //check user and match password
    const result = await loginUser(data)
    // console.log(result)

    //generate token
    const token = createToken({ userId: result.userId, empId: result.empId, role: result.role })
    // console.log(token)


    res.json({
        message: "login successful",
        userId: result.userId,
        role: result.role,
        token: token
    })
}

export async function getMe(req, res, next) {
    // req.user from authenmiddleware
    const user = req.user
    
    //get user data
    const result = await getEmployee(user.empId)

    res.json(result)
}