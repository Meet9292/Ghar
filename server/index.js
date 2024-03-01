import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
dotenv.config()

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to MnogoDB");
})  
.catch((e)=>{
    console.log(e);
})


const app = express()

app.use(express.json())

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})

// API route
app.use("/server/user",userRouter)

// Auth API route
app.use("/server/auth",authRouter)