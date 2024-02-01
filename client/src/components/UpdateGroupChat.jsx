import React,{useState} from 'react'
import { IoEye } from "react-icons/io5";
import { ChatState } from '../store/ChatProvider';
import { toast,ToastContainer } from 'react-toastify';
import axios from 'axios';
import UserItem from './UserItem';
import { Modal,ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
const UpdateGroupChat = ({fetchAgain,setFetchAgain,fetchMessages}) => {
const {selectedChat,user,setSelectedChat}=ChatState()
const [groupChatname,setGroupChatName]=useState(selectedChat?.chatName)
const [search,setSearch]=useState()
const [searchResults,setSearchResults]=useState()
const [openUpdateModel,setOpenUpdateModel]=useState(false)

const handleRemoveUserFromGroupChat=async(u)=>{
  if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
    toast({
      title: "Only admins can remove someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const {data}=axios.put('http://localhost:8000/removeFromGroup',
      {
        chatId: selectedChat._id,
        userId: u._id,
      },
      config
    );
    u._id === user._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
  fetchMessages()
  setGroupChatName("");
}

const handleGroupChat=async(newuser)=>{
    if(selectedChat.users.includes(newuser)){
      toast.warn("User already added",{
          position: toast.POSITION.TOP_CENTER
          })
          return;
    }
    if(selectedChat.groupAdmin._id!==user._id){
        toast.warn("Only Admin Can Add new Members",{
            position: toast.POSITION.TOP_CENTER
            }) 
            return;
    }
    try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
        'http://localhost:8000/addToGroup',
          {
            chatId: selectedChat._id,
            userId: newuser._id,
          },
          config
        );
  
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);

      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setGroupChatName("");
  }
const handleRename=async()=>{
    if(!groupChatname)
    return
  
  try {
    const config={
        headers:{
            Authorization:`Bearer ${user.token}`
        }
      }
const {data}=axios.put('http://localhost:8000/groupChat/rename',{
    chatId:selectedChat._id,
    name:groupChatname
},config)
setSelectedChat(data)
setFetchAgain(!fetchAgain)
toast.success('Successfully Renamed the group',{
    position:toast.POSITION.TOP_CENTER
})

  } catch (err) {
    toast.error(err.response.data.message,{
        position: toast.POSITION.TOP_CENTER
      }); 
  }
}

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

  return (
    <div>
    <button type="button" class="btn btn-secondary" onClick={()=>setOpenUpdateModel(!openUpdateModel)}>
    <IoEye size={25}/>
    </button>  
    <Modal
    isOpen={openUpdateModel}
    toggle={()=>setOpenUpdateModel(!openUpdateModel)}
    size="lg" style={{maxWidth: '650px', width: '100%',marginTop:"15%"}}>    <ModalHeader>
    <h1 class="modal-title fs-5" id="UpdateModalLabel">Update Group Chat</h1>
 
    </ModalHeader>
    <ModalBody>
    <div className='d-flex mt-2 justify-content-between'>
      <input class="form-control" type="search" placeholder="Group name" name="groupChatname" value={groupChatname} onChange={(e)=>setGroupChatName(e.target.value)}/>
      <button className='btn btn-success' onClick={handleRename}>Update</button>
      </div>
      <div className='mt-2 d-flex gap-2'>
      {
          selectedChat&&selectedChat.users.map((u)=>{
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
      <label>Add New Members</label>
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
    <button type="button" class="btn btn-danger" onClick={() => handleRemoveUserFromGroupChat(user)}>Leave Group</button>
    </ModalFooter>
    </Modal>
    </div>
  )
}

export default UpdateGroupChat
