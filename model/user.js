import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    password: { type: String, required: true, minLenght: 6 },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true }
);
// userSchema.pre("save", async function (next) {
//     try {
//         // Hash the password only if it has been modified or is new
//         if (this.isModified("password") || this.isNew) {
//             const hashedPassword = await bcrypt.hash(this.password, process.env.SALT_ROUNDED);
//             this.password = hashedPassword;
//         }
//         next();
//     } catch (err) {
//         next(err);
//     }
// });
const User = mongoose.model("user", userSchema)

export default User