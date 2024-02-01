import React, { useEffect, useState } from 'react'
import { ChatState } from '../store/ChatProvider'
import axios from 'axios';
import SingleChat from './SingleChat';
const ChatArea = ({fetchAgain,setFetchAgain}) => {
  const {user,selectedChat}=ChatState()
  return (
    <div className="flex-column align-items-center p-2 bg-white w-100 border rounded-lg mt-3" style={{ height: '90vh' }}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
  </div>
  
  )
}

export default ChatArea
