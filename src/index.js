
import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/index.js";
import app from "./app.js"
// const app=express()

dotenv.config({
    path:"./.env"
})



connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000, ()=>{
    console.log(`server is running on the ${process.env.PORT}`)
  })
}).catch((error)=>{
  console.log("me index.js hon main or ye err he ",error)
})





