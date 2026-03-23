import { idParamsValidator } from "../utils/zodValidator.js"

export default function paramsValidator(req,res,next){
    try {
        req.params.id = idParamsValidator.parse(req.params.id)
        // for addHouseImage
        req.params?.imageId = idParamsValidator.parse(req.params?.imageId)
        next()
    } catch (error) {
        console.log("error at params validator")
        next(error)
    }
}