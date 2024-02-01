import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChatState } from "../store/ChatProvider";
import AllChats from "../components/AllChats";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
const Chat = () => {
  const { user, selectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className="chat-page " style={{ width: "100%" }}>
      <div>
        <div className="side-bar">{user && <Sidebar />}</div>
        <div
          className="chats d-flex flex-row justify-content-between"
          style={{ width: "100%", marginTop: "2%" }}
        >
          {user && (
            <div
              className={`col-12 col-md-4 ${
                selectedChat && "d-md-flex d-none"
              } `}
            >
              <AllChats fetchAgain={fetchAgain} />
            </div>
          )}
          {user && (
            <div
              className={`col-12 col-md-8 ${
                !selectedChat && "d-md-flex d-none"
              }`}
            >
              <ChatArea fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
          )}
        </div>
      </div>
      {!user && (
        <div className="not-found">
          <h6>
            Page Not Found please login
            <Link to="/">Login</Link>
          </h6>
        </div>
      )}
    </div>
  );
};

export default Chat;
