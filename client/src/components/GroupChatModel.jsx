import React from 'react'
import { useState } from 'react'
import { ChatState } from '../store/ChatProvider'
import axios from 'axios'
import UserItem from './UserItem'
import { ToastContainer, toast } from 'react-toastify';
import {Modal,ModalBody,ModalFooter,ModalHeader} from "reactstrap"

const GroupChatModel = () => {
   const {user,chats,setChats}=ChatState()
    const [groupChatname,setGroupChatName]=useState()
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState()
    const [searchResults,setSearchResults]=useState()
    const [openGroupChatModel,setOpenGroupchatModel]=useState(false) 
    const handleSearch=async(value)=>{
        setSearch(value)
        try{
            const config={
              headers:{
                "Content-Type":'application/json,',
                Authorization:`Bearer ${user.token}`
              }
            }
            const {data}=await axios.get(`http://localhost:8000/users?search=${search}`,config)
            console.log(data)
            setSearchResults(data)
          
          }
          catch(err){
            toast.error(err.response.data.message,{
              position: toast.POSITION.TOP_CENTER
            });   
          }
    }

    const handleSubmit=async()=>{
    if(groupChatname===''||selectedUsers.length===0){
        toast.warn('Fill All Required Fields',{position:toast.POSITION.TOP_CENTER})
      return;
    }
    if(selectedUsers.length<2){
        toast.warn('There should be atleast 3 members to form a group',{position:toast.POSITION.TOP_CENTER})
        return; 
    }
     try{
       const config={
        headers:{
            Authorization:`Bearer ${user.token}`
        }
       }
       const {data}=await axios.post('http://localhost:8000/group',{
        name:groupChatname,
        users:JSON.stringify(selectedUsers.map((u)=>u._id))
       },config)
       setChats([data,...chats])
       toast.success('Group created successfully',{
        position:toast.POSITION.TOP_CENTER
    })
    setGroupChatName('')
    setSelectedUsers([])
    setSearchResults('')
    setSearch('')
    setOpenGroupchatModel(false)
     }
     catch(err){
        toast.error(err.response.data.message,{
            position: toast.POSITION.TOP_CENTER
          });  
     }
    }

    const handleGroupChat=async(newuser)=>{
      if(selectedUsers.includes(newuser)){
        toast.warn("User already added",{
            position: toast.POSITION.TOP_CENTER
            })
      }
      else{
        setSelectedUsers([...selectedUsers,newuser])
      }
    }
    const handleRemoveUserFromGroupChat = async (newUser) => {
        const newSelectedUsers = selectedUsers.filter((u) => u._id !== newUser._id);
        setSelectedUsers(newSelectedUsers);
        console.log(newSelectedUsers);
      };
      

  return (

    <div>
    <button className='btn btn-secondary' onClick={()=>setOpenGroupchatModel(!openGroupChatModel)}>Create New Group</button>
    <Modal
    isOpen={openGroupChatModel}
    toggle={()=>setOpenGroupchatModel(!openGroupChatModel)}
    size="lg" style={{maxWidth: '650px', width: '100%',marginTop:"15%"}}>
    <ModalHeader>
    <h1 >Create Group Chat</h1>
    </ModalHeader>
    <ModalBody>
    <div className='mt-2'>
      <label>New Group Name</label>
      <input class="form-control" type="search" placeholder="Group name" name="groupChatname" value={groupChatname} onChange={(e)=>setGroupChatName(e.target.value)}/>
    </div> 
    <div className='mt-2 d-flex gap-2'>
    {
        selectedUsers&&selectedUsers.map((u)=>{
            return(
                <div key={u._id} className='d-flex justify-content-between px-2 bg-info rounded align-items-center' >
                <p className='mt-2'>{u.name}</p>
                <button type="btn mt-1" class="btn-close" style={{fontSize:'10px'}} onClick={()=>handleRemoveUserFromGroupChat(u)}></button>
                </div>
            )
        })
    }
    </div>
    <div className='mt-2'>
    <label>Add Group Members</label>
    <input class="form-control me-2" type="search" placeholder="Group name" name="search" value={search} onChange={(e)=>handleSearch(e.target.value)}/>
    </div>
    <div className='mt-2'>
    {searchResults&&searchResults.slice(0,4).map((user)=>{
        return(
        <UserItem key={user._id} user={user}  handleFunction={()=>handleGroupChat(user)}/>)
       })
         
       }
    </div>
    </ModalBody>
    <ModalFooter>
    <button type="button" class="btn btn-primary" onClick={handleSubmit}>Create Chat</button>
    </ModalFooter>
    </Modal>
    </div>
  
  )
}

export default GroupChatModel
