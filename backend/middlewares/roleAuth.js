const authorizeRole = (...allowedRoles) =>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.body.role)){
return res.status(403).json({message:'access denied!'})
        }
        next()
    }
}

module.exports= authorizeRole