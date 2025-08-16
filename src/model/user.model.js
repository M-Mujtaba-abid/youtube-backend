import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  password: { // ✅ fixed spelling
    type: String,
    required: [true, "Password is required"]
  },
  refreshToken: {
    type: String
  }
}, { timestamps: true });

// Pre-save hook for hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // ✅ fixed spelling

  this.password = await bcrypt.hash(this.password, 10); // ✅ fixed spelling
  next();
});

// Compare passwords
userSchema.methods.isPasswordCorrect = async function (password) { // ✅ fixed method name
  return await bcrypt.compare(password, this.password);
};

// Generate access token

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET, // ✅ fixed spelling of env var
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName
    },
    process.env.REFRESH_TOKEN_SECRET, // ✅ fixed spelling of env var
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // ✅ fixed spelling expiresIn
  );
};

export const User = mongoose.model("User", userSchema);
