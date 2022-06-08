const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        
        jwt.verify(token,process.env.jwt_secret)
        next()

    }
    catch(err){
        return res.status(401).json({
            err:"Invalid token"
        })
        

    }

}