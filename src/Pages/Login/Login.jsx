import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { baseUrl } from "../../services/api";

import "./Login.css";
import PersonIcon from "@mui/icons-material/Person";
import { setUsers } from "../../redux/reducers";
import KeyIcon from "@mui/icons-material/Key";
import toast from "react-hot-toast";
import { getDecodedToken } from "../../utils/authenticate";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "gaurav",
    password: "underpin",
  });

  useEffect(() => {
    const decodedToken = getDecodedToken();
    if (decodedToken) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await axios.post(`${baseUrl}/api/users/login`, formData);
      console.log(response.data);

      if (response.status === 200) {
        Cookies.set("userToken", response.data.token);
        const decodedToken = jwtDecode(response.data.token);

        toast.success(`Login successful! `);
        dispatch(setUsers(decodedToken));
        navigate(`/dashboard/`);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <>
      <div className="loginPage">
        <form className="loginForm" onSubmit={(e) => handleSubmit(e)}>
          <PersonIcon style={{ fontSize: "150px", color: "white" }} />

          <div className="userLoginFields">
            <PersonIcon />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="loginInput"
              required
            />
          </div>
          <div className="userLoginFields">
            <KeyIcon />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="loginInput"
              required
            />
          </div>

          <button
            className="loginButton"
            type="submit"
            style={{ marginTop: "16px" }}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};
export default Login;
