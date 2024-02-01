const express=require('express')
const router=express.Router()
const {protect} =require('../middleWare/authMiddleware')
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}=require('../controllers/chat')

router.post('/chats',protect,accessChat)
router.get('/chats',protect,fetchChats)
router.post("/group",protect,createGroupChat)
router.put("/groupChat/rename",protect,renameGroup)
router.put('/removeFromGroup',protect,removeFromGroup)
router.put("/addToGroup",protect,addToGroup)

module.exports=router