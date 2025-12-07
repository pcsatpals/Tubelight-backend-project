import dotenv from "dotenv";
import { connectDB as OriginalConnectDB } from "./db/index.js";
import { app } from "./app.js";
import serverless from "serverless-http";
dotenv.config({
  path: "./env",
});

// --- Serverless-safe MongoDB connection ---
let cached = global.mongo;

async function connectDB() {
  if (cached) return cached;
  try {
    cached = await OriginalConnectDB(); // reuse your db/index.js connectDB
    return cached;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

// --- Serverless handler ---
const handler = serverless(app);

// --- Default export required by Vercel ---
export default async function main(req, res) {
  try {
    await connectDB(); // ensure DB is connected
    return handler(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
