import express from "express"
import authRoute from "./routes/auth.route.js"
import errorHandlerMiddleware from "./middlewares/error.middleware.js"
import employeeRoute from "./routes/employee.route.js"
import notfoundMiddleware from "./middlewares/notfound.middleware.js"
import userRoutes from "./routes/user.route.js"
import housesRoutes from "./routes/houses.route.js"
import assignmentRoutes from "./routes/assignment.route.js"
import customerRoutes from "./routes/customer.routes.js"
import surveyRoutes from "./routes/survey.route.js"
import helmet from "helmet"
import cors from "cors";
const app = express()
app.use(express.json())




//CORS
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET" , "POST" , "PUT" , "DELETE"],
    credentials: true
}))
//

//HELMET
app.use(helmet())

app.get("/",(req,res)=> {
    res.send("test")
})

app.use("/api/auth",authRoute)
app.use("/api/employees",employeeRoute)
app.use("/api/users",userRoutes)
app.use("/api/houses",housesRoutes)
app.use("/api/assignments", assignmentRoutes)
app.use("/api/customers",customerRoutes)
app.use("/api/surveys", surveyRoutes)

app.use(errorHandlerMiddleware)
app.use(notfoundMiddleware)

export default app