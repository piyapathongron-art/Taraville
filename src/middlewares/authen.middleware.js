import createHttpError from "http-errors"
import { verifyToken } from "../utils/jwt.js"

function authenMiddleware (req,res,next){
    try {
    // indicate header
    const header = req.headers.authorization
    if(!header){throw createHttpError(404,"no header")}
    console.log(header)
    //split token
    const token = header.split(" ")[1]
    if(!token){throw createHttpError(404,"Token not found")}
    console.log(token)
    //verify token + set payload to req.user
    const result = verifyToken(token)
    req.user = result
    // console.log(req.user)
    next()    
    } catch (error) {
        console.log("error at authMiddleware")
        next(error)
    }
    
}
export default authenMiddleware