import jwt from "jsonwebtoken";
import "dotenv/config";
import createError from "http-errors";

const KEY = process.env.JWT_SECRET

export function createToken(payload){
    const token = jwt.sign(payload,KEY,{algorithm:"HS256", expiresIn:"1D"})
    return token
}

export function verifyToken(token){
    try {
        const payload = jwt.verify(token,KEY,{algorithms:["HS256"]})
        return payload
    } catch (error) {
        console.log(error)
        throw createError(401,"token mismatch")
    }
}