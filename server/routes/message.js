const express=require('express')
const router=express.Router()
const {protect} =require('../middleWare/authMiddleware')
const {sendMessages,allMessages}=require('../controllers/messages')
router.post('/messages',protect,sendMessages)
router.get('/messages/:chatId',protect,allMessages)


module.exports=router