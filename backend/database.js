import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async ()=>{
    
    try{
        await mongoose.connect(globalThis.process.env.MONGO_URI,{});
        console.log("Mongo connected successfully");
    }catch(err)
    {
        console.log(err.message);
        globalThis.process.exit(1);
    }
}

export default connectDB;