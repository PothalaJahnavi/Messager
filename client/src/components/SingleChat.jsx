import React, { useEffect, useState } from "react";
import { ChatState } from "../store/ChatProvider";
import { getSender } from "../chatLogics/logic";
import UpdateGroupChat from "./UpdateGroupChat";
import { IoArrowBack } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import ChatMessages from "./ChatMessages";
import io from "socket.io-client";

const ENDPOINT = "https://messager-kr0l.onrender.com";
var socket, compareChat;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [message, setMessage] = useState("");
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);

  
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://messager-kr0l.onrender.com/messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      socket.emit("Join Chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMessages();
    compareChat = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setTyping(true));
    socket.on("stop typing", () => setTyping(false));
  }, []);

 
  console.log('notifications',notification)

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !compareChat || // if chat is not selected or doesn't match current chat
        compareChat._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  const sendMessage = async () => {
    socket.emit("stop typing", selectedChat._id,user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(message);
      const { data } = await axios.post(
        "https://messager-kr0l.onrender.com/messages",
        {
          chatId: selectedChat._id,
          content: message,
        },
        config
      );
      console.log(data);
      setMessage("");
      setMessages([...messages, data]);
      socket.emit("new message", data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleTyping = async (e) => {
    setMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id,user._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id,user._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div>
      {selectedChat ? (
        <div>
          <div className="d-flex justify-content-between m-2">
            <div>
              <h4 className="d-none d-md-inline">
                {!selectedChat.isGroupChat
                  ? getSender(user, selectedChat.users)
                  : selectedChat.chatName}
              </h4>
              <div className="d-md-none d-inline">
                <IoArrowBack size={40} onClick={() => setSelectedChat("")} />
              </div>
            </div>
            <div>
              {selectedChat.isGroupChat && (
                <UpdateGroupChat
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}
            </div>
          </div>
          <div
            className="d-flex flex-column chat-area p-2"
            style={{ justifyContent: "flex-end" }}
          >
            <div className="all-messages">
              <ChatMessages messages={messages} />
            </div>
            {typing && <div className="fw-bold">Typing</div>}
            <div class="mb-3 d-flex" style={{ marginBottom: "0" }}>
              <input
                placeholder="Type Your Message Here"
                type="text"
                class="form-control bg-light"
                id="message"
                value={message}
                onChange={(e) => handleTyping(e)}
              />
              <button className="btn btn-success" onClick={sendMessage}>
                <IoMdSend size={25} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-fluid d-flex align-items-center">
          <p>Click On Any User To Start Chating</p>
        </div>
      )}
    </div>
  );
};

export default SingleChat;
