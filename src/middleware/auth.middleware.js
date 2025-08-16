
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import  {User}  from "../model/user.model.js";
import apiError from "../utils/apiError.js"
export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ","")
    
        if(!token){
           throw new  apiError(400,"un_authorize request")
        }
    
         const decodedToken=  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new apiError(401,"invalid access token ")
    
        }
    
        req.user=user
        next()
    } catch (error) {
        throw new apiError(401, error?.message,"invalid access token ")
        
    }
})