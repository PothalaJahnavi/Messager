const express=require('express')
const router=express.Router()
const {register,login, allUsers}=require('../controllers/user')
const {protect} =require('../middleWare/authMiddleware')


router.post('/register',register)
router.post('/login',login)
router.get('/users',protect,allUsers)

module.exports=router