 import mongoose  from "mongoose";
 import { DB_NAME } from "../constants.js";


 const connectDB=async()=>{
 try {
    

     const connectionInstance= await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`)
     console.log(` mongo db chal gya bro || DB host : ${connectionInstance.connection.host}`)
 } catch (error) {
    console.log("this is catch part ",error)
     process.exit(1);   // process band kar dena agar DB connect na ho
 }

 }

 export default connectDB


