import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import { User } from "../model/user.model.js"
import { response } from "express"
import apiResponse from "../utils/apiResponse.js"
const registerUser=( asyncHandler(async(req,res)=>{
     


    const {userName , fullName, email, passward}=req.body

if([userName,fullName,email,passward].some((i)=> i.trim()==="")){

   throw new  apiError(400, "all feilds are required")
}


const existedUser=User.findOne({
    $or: [{userName},{email}]
})
  
if(existedUser){
    throw new apiError(405, "user name and eamil already exist")
}


const avtarLocalPath= req.files?.avatar[0].path

if(!avtarLocalPath){
    throw new apiError(400,"Avatar file  is required ")
}
// console.log(avtarLocalPath)

const coverImageLocalPath= req.files?.coverImage?.[0].path



 const user= await  User.create({
    fullName,
    avatar : response.url,
    coverImage : coverImage?.url || "",
    userName: userName.toLowerCase(),
    email,
    passward,
})

const createdUser = await User.findById(user._id).select(
    "-passward -refreshToken "
)

if(!createdUser){
     throw new apiError(500,"something went wrong while registring the user")
}
 
return res.status(201).json(
    new apiResponse(200,createdUser,"user register successfully")
)







}
)) 


export {registerUser}