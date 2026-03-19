import { ZodError } from "zod"

export default function errorHandlerMiddleware (err,req,res,next){
    console.log("!!!!!!!ERROR!!!!!!!")
    console.log(err)

       if(err instanceof ZodError) {
        console.log(err.flatten())
       return res.status(400).json({
           message: "Validation Error",
           errors: err.flatten().fieldErrors
           // errors: err.issues.map(err => err.message)
       })
   }

    res.status(err.status || 500).json({error: err.message || "Internal Server Error"})
}