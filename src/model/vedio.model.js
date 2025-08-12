import mongoose, { Schema }  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const vedioSchema=new Schema({
    vedioFile:{
        type:String,
        required:[true, "vedio is required"]
    },
    thumbNail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    duration:{
        type: Number,
        required:true,
    },
    views:{
        type:Boolean,
        default:0,
    },
    isPublished:{
       type:Boolean,
       default:true
    },
    views:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timeSamps: true})


vedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio=mongoose.model("Vedio",vedioSchema)