const jwt = require('jsonwebtoken')
require('dotenv').config()

const createToken = (id)=>{
    return jwt.sign(id,process.env.SECRET_KEY)
}
  

const verifyToken = async(req,res,next)=>{
    const cookie = req.headers.cookie
    if (cookie){
        const token = cookie.split('=')[1]
        const id = parseInt(jwt.verify(token,process.env.SECRET_KEY))
        req.userId = id
        next()
    }
    else{
        res.send("You have to login first")
    }
}

module.exports = {createToken,verifyToken}