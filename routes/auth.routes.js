const router = require('express').Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt  = require('bcrypt')
const {createToken, verifyToken} = require('../auth/user.auth')

router.post('/user/register', async (req, res) => {
  const {name,email,password}= req.body
  try {
    const encrypted = await bcrypt.hash(password,10)
    const user = await prisma.user.create({
      data:{
        name,
        email,
        password:encrypted
      }
    })
    res.status(200).send({status:'user added successfully'})
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
});


router.get('/user/login', async(req,res)=>{
  const {email,password} = req.body
  try {
    const user = await prisma.user.findUnique({
      where:{
        email
      }
    })
    const isPasswordMatched  = await bcrypt.compare(password,user.password)
    if (isPasswordMatched){
      const token = createToken(user.id)
      res.cookie('authtoken',token).send('You are logged in successfully')
    }
  } catch (error) {
    res.send(error.message)
  }
})


router.get('/user/logout',verifyToken, async(req,res)=>{
  res.clearCookie('authtoken').status(401).send("you logged out")
})

module.exports = router;
