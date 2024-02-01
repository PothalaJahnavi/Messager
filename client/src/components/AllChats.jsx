import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../store/ChatProvider";
import { ToastContainer, toast } from "react-toastify";
import GroupChatModel from "./GroupChatModel";
import { getSender } from "../chatLogics/logic";
import { formatMessageTime } from "../chatLogics/logic";
const AllChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { chats, setChats, selectedChat, setSelectedChat, user } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("http://localhost:8000/chats", config);
      setChats(data);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    console.log('chat',chats)
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="container-fluid">
      <div
        className="flex-column align-items-center p-2 bg-white w-100  border rounded-lg mt-3"
        style={{ height: "90vh" }}
      >
        <div className="d-flex justify-content-between align-items-center pb-3 px-3">
          <span style={{ fontSize: "28px", fontFamily: "Work Sans" }}>
            My Chats
          </span>
          <GroupChatModel />
        </div>
        <div className="d-flex flex-column p-3 w-100 h-100 rounded-lg overflow-hidden">
          {chats && (
            <div className="overflow-scroll">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className="cursor-pointer mt-3 px-3 py-2 rounded-lg "
                  style={{
                    borderRadius: "10px",
                    backgroundColor: `${
                      selectedChat === chat
                        ? " rgb(183, 213, 240)"
                        : "rgb(179, 181, 182)"
                    }`,
                    cursor:'pointer'
                  }}
                >
                  <span>
                    <b>{!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}</b>
                  </span>
                  {chat.latestMessage && (
                    <div className="d-flex justify-content-between">
                    <p style={{ fontSize: "xs" }}>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </p>
                    <p>{formatMessageTime(chat.latestMessage.timestamp)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AllChats;
