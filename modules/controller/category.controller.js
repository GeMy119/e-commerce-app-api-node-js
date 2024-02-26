import slugify from "slugify";
import Category from "../../model/category";
import AsyncHandler from "express-async-handler";


const getCategories = AsyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const allCategories = await Category.find({}).skip(skip).limit(limit);
    res.status(200).json({ page, limit, data: allCategories });

});

const getSingleCategory = AsyncHandler(async (req, res) => {
    const id = req.params.id
    const category = await Category.findById(id)
    if (!category) {
        res.status(404).json({ message: `there is no category for this ${id}` })
    }
    res.status(200).json({ category })
})

const addCategory = AsyncHandler((req, res) => {
    const name = req.body.name
    const category = Category.create({ name, slug: slugify(name) })
    res.status(201).json({ message: "category added", category })
})

const deleteCategory = AsyncHandler(async (req, res) => {
    const id = req.params.id
    const category = await Category.deleteOne({ _id: id })
    if (category.deletedCount === 0) {
        res.status(404).json({ message: `there is no category for this ${id}` })
    }
    res.status(200).json({ message: "deleted" })
})

const updateCategory = AsyncHandler(async (req, res) => {
    const id = req.params.id
    const { name } = req.body
    const category = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
    if (!category) {
        res.status(404).json({ message: `there is no category for this ${id}` })
    }
    res.status(200).json({ data: category })
})

export {
    addCategory,
    getCategories,
    deleteCategory,
    updateCategory,
    getSingleCategory
}