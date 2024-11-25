
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized!' });
    }

    try {
        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        // Attach the decoded token data to req.user
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            verified: decoded.verified,
            role: decoded.role,
        };
            next()
       
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token!' });
    }
};

const authorizeRole = (...allowedRoles) =>{
   
    return (req,res,next)=>{
        const userRole = req.user?.role.toLowerCase();
        
        const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase())
        if(!normalizedAllowedRoles.includes(userRole)){
return res.status(403).json({message:'access denied!'})
        }
        next()
    }
}

module.exports= { authenticateUser, authorizeRole} 