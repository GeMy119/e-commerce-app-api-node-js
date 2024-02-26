import express from "express";
import { login, signup, softDeletedUser, verifyAccount } from "../controller/user.controller.js";
import { verifyTokenAndAuthorization } from "../../config/auth.js";
const userRouter = express.Router()

//auth router
userRouter.post("/user/signup", signup)
userRouter.post("/user/login", login)
userRouter.get("/user/verify/:token", verifyAccount)
//end auth router

// crud router
userRouter.put("/user/softDelete/:id", verifyTokenAndAuthorization, softDeletedUser)

export default userRouter