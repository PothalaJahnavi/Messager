const expressAsyncHandler = require("express-async-handler");
const Chat=require('../models/chat')

// create or fetch one on one chat
// if a chat with the user id exists we are going to fetch the chat otherwise we are going to create a new chat
const accessChat=expressAsyncHandler(async(req,res)=>{
    const {userId}=req.body
    console.log(userId)
    if(!userId){
        return res.sendStatus(400)
    }
    // checking if chat with userid exists
    const isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$eq:req.user._id}},
            {users:{$eq:userId}}
        ]
    }).populate("users","-password").populate({
        path:'latestMessage',
        model:'Message',
        populate:{
            path:'sender',
            model:'User',
            select:'name email'
        }
     })     
    if(isChat.length>0){
      res.send(isChat[0])
    }
    else{
        // creating new chat
        try{
             const createChat=await Chat.create({
                chatName:'sender',
                isGroupChat:false,
                users:[req.user._id,userId]
             })
             const fullChat=await Chat.findOne({_id:createChat._id}).populate("users","-password")
             res.status(200).send(fullChat)
        }
        catch(err){
            throw new Error(err.message)
        }
    }
})

// All chats for that user
const fetchChats=expressAsyncHandler(async(req,res)=>{
    try{
        const AllChats=await Chat.find({
            $and:[{users:{$eq:req.user._id}}]
         }).populate("users groupAdmin","-password").populate({
            path:'latestMessage',
            model:'Message',
            populate:{
                path:'sender',
                model:'User',
                select:'name email'
            }
         }).sort({updatedAt:-1})
         
         res.status(200).send(AllChats)
    }
    catch(err){
          throw new Error(err.messages)
    }
})

const createGroupChat=expressAsyncHandler(async(req,res)=>{
   
    if(!req.body.users||!req.body.name){
       return res.status(400)
    }
    const users=JSON.parse(req.body.users)
    if(users.length<2){
      return res.status(400).send("More than 2 users are needed to form a group")
    }
    users.push(req.user)
    try{
        const groupChat=await Chat.create({
            chatName:req.body.name,
            isGroupChat:true,
            users:users,
            groupAdmin:req.user
        })
        const fullChat=await Chat.findOne({_id:groupChat._id}).populate('users groupAdmin',"-password")
        return res.status(200).json(fullChat)
    }
    catch(err){
        throw new Error(err.message)
    }

})

const renameGroup=expressAsyncHandler(async(req,res)=>{
   
    const {chatId,name}=req.body
    if(!chatId||!name){
        res.status(400)
    }
    try{
    const updatedChat=await Chat.findByIdAndUpdate(chatId,{chatName:name},{new:true}).populate("users groupAdmin","-password")
    if(updatedChat)
    return res.json(updatedChat)
    else
    return res.status(400)
}
catch(err){
    throw new Error(err.message)
}
})

const removeFromGroup=expressAsyncHandler(async(req,res)=>{
   const {chatId,userId}=req.body
   if(!chatId||!userId){
    return res.status(400)
   }
   try{
    const updatedChat=await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
      },{new:true}).populate("users groupAdmin","-password")
      if(updatedChat)
      return res.status(200).json(updatedChat)
      else
      return res.status(400)
   }
   catch(err){
    throw new Error(err.message)
   }
})

const addToGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body
    if(!chatId||!userId){
     return res.status(400)
    }
    try{
      const updatedChat=await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId}
      },{new:true}).populate("users groupAdmin","-password")
      if(updatedChat)
      return res.status(200).json(updatedChat)
      else
      return res.status(400)
    }
    catch(err){
     throw new Error(err.message)
    }
})
module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}
