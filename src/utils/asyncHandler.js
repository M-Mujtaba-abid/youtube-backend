const asyncHandler =(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).then((err)=>{console.log("ye err he me asynhandeler file se hon ",err)})

    }
}

export default asyncHandler