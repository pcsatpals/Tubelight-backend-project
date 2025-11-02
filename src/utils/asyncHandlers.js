// By using Promises
const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}


// By using the Try catch
const asyncHandler1 =(requestHandler)=>async (req,res,next)=>{
try{
await requestHandler(req,res,next)
}catch(err){
res.statusCode(err.code || 500).json({ 
        success:false,
        message:err.message
    })
}
}

export {asyncHandler, asyncHandler1}
