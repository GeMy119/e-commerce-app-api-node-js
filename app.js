import express from "express"
const app = express()
import morgan from "morgan"
import dontenv from "dotenv"
import cors from "cors"
import { connection } from "./config/connection.js"
import errorHandler from "./config/handleError.js"
import userRouter from "./modules/router/user.router.js"
import categoryRouter from "./modules/router/category.router.js"

dontenv.config({ path: ".env" })
const port = process.env.PORT || 5000
if (process.env.MODE_ENV === "development") {
    app.use(morgan("dev"))
    console.log(process.env.MODE_ENV)
}
app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(categoryRouter)
app.use(errorHandler)
connection()
app.listen(port, () => {
    console.log("running in port " + port)
})