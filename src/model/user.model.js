import mongoose, { Schema }  from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String, // Cloudinary URL
    required: true
  },
  coverImage: {
    type: String
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video"
    }
  ],
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  refreshToken: {
    type: String
  }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    //pasward chnage krne pr hi change ho 
    if(this.isModified("passward")) return next()
      
        //pass encrypt kr ne ka code
    this.passward= await bcrypt.hash(this.passward, 10)
    next()
})
  


//passward uncrypt kr ke again deikhy ga ke match ho rhahe ke ni 
userSchema.method.isPasswardCorrect = async function (passward) {
    return await bcrypt.compare(passward,this.passward)
}

// payload bhaij rha ho token me
userSchema.methods.generateAccessToken= function(){
 return   jwt.sign({
        _id:this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    },
    process.env.ACCES_TOKEN_SECRET,
    {
       expiresIN: process.env.ACCES_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken= function(){
     return   jwt.sign({
        _id:this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    },
    process.env.REFRESH_TOKEN_TOKEN,
    {
       expiresIN: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
    
export const User = mongoose.model("Vedio",userSchema)