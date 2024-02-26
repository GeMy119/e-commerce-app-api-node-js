import express from "express";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../controller/category.controller";
const categoryRouter = express.Router()
import { verifyTokenAndAdmin } from "../../config/auth.js";


categoryRouter.get("/", getCategories)
categoryRouter.get("/:id", getSingleCategory)
categoryRouter.post("/addCategory", verifyTokenAndAdmin, addCategory)
categoryRouter.delete("/deleteCategory/:id", verifyTokenAndAdmin, deleteCategory)
categoryRouter.put("/updateCategory/:id", verifyTokenAndAdmin, updateCategory)

export default categoryRouter