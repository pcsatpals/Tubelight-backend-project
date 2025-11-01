import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB =async ()=>{
    try{
const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    }catch(er){
        console.log("MongoDB Connection Error",er);
process.exit(1)

    }
}