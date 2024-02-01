import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { MdNotifications } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ChatState } from "../store/ChatProvider";
import axios from "axios";
import { getSender } from "../chatLogics/logic";
import UserItem from "./UserItem";
const Sidebar = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState("");
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json,",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:8000/users?search=${search}`,
        config
      );
      console.log(data);
      setSearchResults(data);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const accessChat = async (userId) => {
    console.log('id',userId)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:8000/chats",
        { userId },
        config
      );
      if (chats.find((c) => c.id === data._id)) {
        setChats([...data, chats]);
      }
      console.log(data);
      setSelectedChat(data);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="card d-flex flex-row justify-content-between">
      <nav class="navbar navbar-light bg-light fixed-top">
        <div class="container-fluid">
          <button
            class="btn btn-transparent d-flex p-2 justify-content-between align-items-center"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
            aria-label="Toggle navigation"
            style={{border:'none',outline:'none'}}
          >
            <FaSearch size={20} />
            <span class="d-none d-md-inline">search for users</span>
          </button>
          <div>
            <h2>Let's Chat</h2>
          </div>
          <div className="d-flex flex-row">
            <div class="dropdown position-static">
              <button
                class="btn btn-transparent dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ border: "none", outline: "none" }}
              >
                <div className="position-relative">
                  <MdNotifications className="" size={30} />
                  {notification.length > 0 && (
                    <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                      {notification.length}
                    </span>
                  )}
                </div>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                {!notification && <li>No New Messages</li>}
                {notification &&
                  notification.map((notify) => {
                    return (
                      <li>
                        <div
                          onClick={() => {
                            setSelectedChat(notify.chat);
                            setNotification(
                              notification.filter((n) => n !== notify)
                            );
                          }}
                          className="mb-2 fw-bold"
                          style={{ backgroundColor: "aliceblue",cursor:'pointer' }}
                        >
                          {notify.chat.isGroupChat
                            ? `New Message in ${notify.chat.chatName}`
                            : `New Message from ${getSender(
                                user,
                                notify.chat.users
                              )}`}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div class="dropdown position-static">
              <button
                class="btn btn-transparent dropdown-toggle border-none"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ border: "none", outline: "none" }}
              >
                <RxAvatar size={30} />
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end text-center p-2"
                style={{ border: "none" }}
              >
                <li
                  className="mb-2 fw-bold"
                  style={{ backgroundColor: "aliceblue" }}
                >
                  {user.name}
                </li>
                <li
                  onClick={handleLogout}
                  style={{ cursor: "pointer", backgroundColor: "aliceblue" }}
                  className="mb-2 fw-bold"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
          <div
            class="offcanvas offcanvas-start text-bg-light"
            tabindex="-1"
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div class="offcanvas-header">
              <button
                type="button"
                class="btn-close btn-close-black"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-start flex-grow-1 pe-3">
                <div class="d-flex mt-3" role="search">
                  <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button class="btn btn-success" onClick={handleSearch}>
                    Search
                  </button>
                </div>
                <div className="mt-2">
                  {searchResults &&
                    searchResults.map((user) => {
                      return (
                        <UserItem
                          user={user}
                          handleFunction={() => accessChat(user._id)}
                        />
                      );
                    })}
                </div>
              </ul>
            </div>
          </div>
        </div>
        <ToastContainer />
      </nav>
    </div>
  );
};

export default Sidebar;
