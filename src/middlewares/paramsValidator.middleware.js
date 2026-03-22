import { idParamsValidator } from "../utils/zodValidator.js"

export default function paramsValidator(req,res,next){
    try {
        req.params.id = idParamsValidator.parse(req.params.id)
        next()
    } catch (error) {
        console.log("error at params validator")
        next(error)
    }
}