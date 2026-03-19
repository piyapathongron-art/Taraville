import createHttpError from "http-errors";

export function adminAuthen(req,res,next){
    const userRole = req.user.role
    if(userRole !== "Admin"){
        throw createHttpError(401,"admin role only")
    }
    next()
}

export function staffAuthen(req,res,next){
    const userRole = req.user.role
    if(userRole !== "Admin" || "Staff"){
        throw createHttpError(401,"admin or staff only")
    }
    next()
}