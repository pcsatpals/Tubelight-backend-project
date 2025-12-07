import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

// Connect to MongoDB once
connectDB().catch((err) => {
  console.error("MONGODB connection Failed: ", err);
});

export const handler = serverless(app);

// Optional: local dev server
if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("App listening on port: ", process.env.PORT || 8000);
    });
  });
}

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
