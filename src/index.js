import dotenv from 'dotenv'
import { connectDB } from './db/index.js'


dotenv.config({
    path:"./env"
})


connectDB()



// import mongoose from 'mongoose';
// import { DB_NAME } from './constant';
// import express from "express";

// const app = express();

// ;(async ()=>{
//     const PORT = process.env.PORT
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//        app.on("error",(er)=>{
//         console.log("Error: ", er);
//         throw er
//        });

//        app.listen(PORT, ()=>{
//         console.log(`App is listening on Port: ${PORT}`)
//        })
//     }catch(er){
//         console.error("Error: ",er);
//         throw er
//     }
// })()