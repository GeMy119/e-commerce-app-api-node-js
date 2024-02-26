import mongoose from "mongoose";

const categorySchem = new mongoose.Schema({
    name: { type: String, required: true, unique: true, maxlenght: 32, minlenght: 3 },
    image: { type: String },
    slug: { type: String, }
},
    {
        timestamps: true
    }
)

const Category = mongoose.model("category", categorySchem)

export default Category