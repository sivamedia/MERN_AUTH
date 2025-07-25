import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoute.js';
import userRouter from "./routes/userRoutes.js";

import os from 'os';

const app = express();
const port = process.env.PORT || 4000

connectDB();

const allowOrigins = ['http://localhost:5173','http://localhost:4000']


const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cookieParser());
app.use(cors({origin: allowOrigins, credentials: true}))


app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.use(function (req, res, next) {
    console.log("request.body server.js use =======>" , req.originalUrl)
    console.log("request.body server.js use =======>" , req.body) 
    console.log("server.js use cookies",req.cookies)
    if(!req.body ) req.body = {}
    console.log("request.body server.js use =======>" , req.body) 

    next()
}
);

app.get('/',(req,res)=> res.send("API Working ... "));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const hostname = os.hostname();
console.log(`Server hostname: ${hostname}`);

app.listen(port, hostname,()=> {
                          console.log(`Server Started on PORT : ${port}`);

                      }
          );

