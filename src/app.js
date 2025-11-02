import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:process.env.crossOrigin,
    credentials:true
}));

//to describe that we are going to accept only JSON data for now
app.use(express.json({limit: "16kb"}))

// To accept the encoded URL also for example Google convert spaces to "20%"
app.use(express.urlencoded({extended:true, limit: "16kb"}))
// To store media or static files into public folder
app.use(express.static('public'));
// To perform CRUD operations on cookies
app.use(cookieParser())

export {app}