import { idParamsValidator, imageIdParamsValidator } from "../utils/zodValidator.js"

export default function paramsValidator(req,res,next){
    try {
        // console.log(typeof req.params.id)
        req.params.id = idParamsValidator.parse(req.params.id)
        // console.log(typeof req.params.id)
        // for addHouseImage
        req.params.imageId = imageIdParamsValidator.parse(req.params.imageId)
        // console.log(typeof req.params.imageId)
        
        next()
    } catch (error) {
        console.log("error at params validator")
        next(error)
    }
}