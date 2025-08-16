import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../model/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import uploadOnCloudinary from "../utils/cloudinaryFileUpload.js"; // assuming file upload helper
import {verifyJWT} from "../middleware/auth.middleware.js";
// import jwt from "jsonwebtoken";

// import { use } from "react";

const generateAccessAndRefreshToken=async (userId)=>{
    try {
      const user= await User.findById(userId)
       const accessToken= user.generateAccessToken()
       const refreshToken= user.generateRefreshToken()
       user.refreshToken=refreshToken
       await user.save({ validateBeforeSave: false })

       return {accessToken,refreshToken}
    } catch (error) {
      console.log("ye err he token bnaty hoi ",error)
      throw new apiError(500,"getting an error while generating access and refresh token ")
    }

}

// user register here
const registerUser = asyncHandler(async (req, res) => {
  // console.log("📩 registerUser reached");
  // console.log("Body:", req.body);
  // console.log("Files:", req.files);

  const { userName, fullName, email, password } = req.body;
console.log("me controler me hon 95 pr ye he req.body ",req.body)
  // Validate fields
  if ([userName, fullName, email, password].some((i) => !i || i.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  // Check for existing user
  const existedUser = await User.findOne({
    $or: [{ userName: userName.toLowerCase() }, { email }],
  });

  if (existedUser) {
    throw new apiError(405, "Username or email already exists");
  }

  // Validate avatar file
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }
  console.log("me contoller me 115 pr hon req.files", req.files)

  // Optional cover image
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Upload to Cloudinary
  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUpload = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : "";

  // Create user
  const user = await User.create({
    fullName,
    avatar: avatarUpload?.url || "",
    coverImage: coverImageUpload?.url || "",
    userName: userName.toLowerCase(),
    email,
    password, // model me pre-save hook hash karega
  });

  // Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered successfully"));
});

//user login here 
const loginUser=asyncHandler(async(req,res)=>{
 const {userName, email, password}=req.body
     if ((!userName && !email) || !password) {
    throw new apiError(400, "Username or email and password are required");
  }

   const user =await User.findOne({
    $or :  [{ email },{ userName }]
   })

   if(!user){
    throw new apiError(400 ," user doen not exist ")
   }

  const  isPassword = await user.isPasswordCorrect(password)
  if(!isPassword){
    throw new apiError(400, "password is incorrect")
  }

  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
console.log(`me hon accessToken ${accessToken}, me hon refreshToken ${refreshToken}`)
   const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

   const Option= {
    httpOnly: true,
    secure: true
   }
  return res.status(200)
  .cookie("accessToken",accessToken,Option)
  .cookie("refreshToken" , refreshToken,Option)
  .json(
    new apiResponse(200,{
        user: loggedInUser, refreshToken,accessToken
      },
    "user logedin successffuly"
    )
  )

})

//password reset option 
const changePassword =(asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword}= req.body
    const user= User.findById(req.user?._id)
    const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
      throw new apiError(400,"invalid password")
    }
        user.password=newPassword
        await user.save({validateBeforeSave:false})

        return res.status(200).json(new apiResponse(200,{},"password changed successfully"))
 }))
//user logout
const logoutUser=(asyncHandler(async(req,res,next)=>{
    User.findByIdAndUpdate(req.user._id,
      {  $set:{ refreshToken: undefined}},
      {new : true }
  )

  
   const Option= {
    httpOnly: true,
    secure: true
   }

   return res.status(200).clearCookie("accessToken",Option)
   .clearCookie("refreshToken",Option).json(new apiResponse(200,"user logout successfully"))

}))

// refreshtoken se again access deny ke liye 
const refreshTokenAccess=(asyncHandler(async(req,res,next)=>{
   try {
     const inComingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
 
     if(!inComingRefreshToken){
       throw new apiError(401,"unauthorized access")
     }
 
     const decodedToken= jwt.verify(inComingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
     // if(decodedToken)
     const user= await User.findById(decodedToken?._id)
 
     if(!user){
       throw new apiError(401,"invalid Refresh token")
     }
     
     if(inComingRefreshToken !== user.refreshToken){
       throw new apiError(401,"refresh token is used or expired")
     }
 
     const option ={
       httpOnly:true,
       secure:true
     }
     const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user?._id)
     return res.status(200).cookie("accessToken",accessToken,option).cookie("refreshToken",refreshToken, option).json(
       new apiResponse(200,{accessToken,refreshToken}, 
         "access token refreshed"
       )
     )
   } catch (error) {
    throw new apiError(401, error?.message || "invalid refresh token ")
   }
}))

//get currentUser
const getCurrentUser=asyncHandler(async(req,res)=>{
  return res.status(200).json(200,req.user, "current user fetch successfully")
})

// update Account Details
const updateAccountDetails=asyncHandler(async(req,res)=>{
  const {fullName,email } = User.body

  if(!fullName || !email){
     throw new apiError("fullname and email is required")
  }

 const userUpdated=  User.findByIdAndUpdate(req.user?._id,
    {
      $set: {fullName, email}
    },
    {new: true}
  ).select("-password")

  return res.status(200).json(new apiResponse(200,userUpdated, "account details updated successfully"))
})

// update avatar file 
const updateUserAvatar=asyncHandler(async(req,res,next)=>{
  
const avatarLocalPath= req.file?.path
if(!avatarLocalPath){
  throw new apiError(400,"Avatar  file is missing while in user controller line 225")
}

 await User.findByIdAndUpdate(req.user?._id,
  {
    $set:{ avatar: avatar.url}
  },
  {new: true}
 ).select("-password")
   
 return res.status(200).json(new apiResponse(200, avatarLocalPath," avatar file is updates successfully"))
})

// update user cover image 
const updateUserCoverImage=asyncHandler(async(req,res)=>{
  const  coverImageLocalPath=req.file?.path

  if(!coverImageLocalPath){
    throw new apiError(400, "userImage can't find while updating image user controller line 243")
  }

  await User.findByIdAndUpdate(req.file?.path,
    {
      $set: { coverImage: coverImage.url}
    },
    {}
  ).select("-password")
  return res.status(200).json(new apiResponse(200,coverImageLocalPath,"cover image updated successfully "))
})
export { registerUser ,loginUser, logoutUser,refreshTokenAccess,changePassword,getCurrentUser ,updateAccountDetails, updateUserAvatar, updateUserCoverImage };
