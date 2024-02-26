import mongoose from "mongoose"
mongoose.set("debug", true); // Enable Mongoose debugging
const connection = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("DB is running....")
    }).catch((err) => {
        console.log(err)
    })
}


export { connection }