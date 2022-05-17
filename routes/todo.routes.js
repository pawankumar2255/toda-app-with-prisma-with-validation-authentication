const router = require('express').Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const { verifyToken } = require('../auth/user.auth')


router.post('/user',verifyToken, async(req,res)=>{
    const {title,content} = req.body
    try {
        await prisma.todos.create({
            data:{
                title,
                content,
                userId:req.userId
            }
        })
        res.status(201).send({status:'todo created'})
    } catch (error) {
        res.send(error.message)
    }
})


router.get('/user',verifyToken, async(req,res)=>{
    try {
        const allTodoOLoggedInUser = await prisma.todos.findMany({where:{userId:req.userId}})
        res.send(allTodoOLoggedInUser)
    } catch (error) {
        res.send(error.message)
    }
})


router.patch('/user/:todoId',verifyToken, async(req,res)=>{
    const id = parseInt(req.params.todoId)
    try {
        await prisma.todos.updateMany({where:{userId:req.userId,id},data:req.body})
        res.send('data updated sucessfully')
    } catch (error) {
        console.log(error.message);
        res.send(error.message)
    }
})

router.delete('/user/:todoId',verifyToken, async(req,res)=>{
    const id = parseInt(req.params.todoId)
    try {
        await prisma.todos.deleteMany({where:{userId:req.userId,id}})
        res.send('todo deleted successfully')
    } catch (error) {
        console.log(error.message);
        res.send(error.message)
    }
})



module.exports = router
