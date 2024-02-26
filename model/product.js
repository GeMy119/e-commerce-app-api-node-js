import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    des: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    categories: { type: String },
    size: { type: String },
    color: { type: String },
},
    { timestamps: true }
)


const Product = mongoose.model("product", productSchema)

export default Product