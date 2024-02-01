import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.warn("Please Fill All Data", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (password !== confirmPassword) {
      toast.warn("Password and Confirm Password should match", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      try {
        const res = await axios.post("https://messager-kr0l.onrender.com/register", {
          name: name,
          email: email,
          password: password,
        });
        if (res.data) {
          toast.success("User Registered Successfull", {
            position: toast.POSITION.TOP_CENTER,
          });
          localStorage.setItem("userInfo", JSON.stringify(res?.data));
          navigate("/chats");
        }
      } catch (err) {
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  return (
    <div>
      <h6 className="text-center">Register</h6>
      <div class="mb-3">
        <label for="name" class="form-label">
          Name
        </label>
        <input
          type="text"
          class="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">
          Email
        </label>
        <input
          type="email"
          class="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">
          Password
        </label>
        <input
          type="password"
          class="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div class="mb-3">
        <label for="Confirmpassword" class="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          class="form-control"
          id="Confirmpassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <button
          className="btn btn-primary"
          style={{ width: "100%" }}
          onClick={handleRegister}
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
