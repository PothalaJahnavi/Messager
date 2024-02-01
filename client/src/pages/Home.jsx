import React, { useContext, useEffect, useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [currentStatus, setCurrentStatus] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div>
    <h2 className="text-center text-light fw-bolder fs-1">Messager App</h2>
    <div className="container d-flex flex-column d-flex align-items-center justify-content-center vh-100">
      <div className="card mb-3 p-3 w-50">
        <div className="card-title text-center">
          <h2 className="text-success">Connect Through Chating</h2>
        </div>
      </div>
      <div className="card w-50">
        <div className="d-flex flex-row">
          <button
            className={`btn ${currentStatus === "login" ? "btn-primary" : ""}`}
            onClick={() => setCurrentStatus("login")}
            style={{ width: "50%" }}
          >
            Login
          </button>
          <button
            className={`btn ${
              currentStatus === "register" ? "btn-primary" : ""
            }`}
            onClick={() => setCurrentStatus("register")}
            style={{ width: "50%" }}
          >
            Register
          </button>
        </div>
        <div className="p-3">
          {currentStatus === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
