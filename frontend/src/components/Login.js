/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./LoginRegister.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [action, setAction] = useState(""); // Tracks active form
  const [loginData, setLoginData] = useState({ Email: "", Password: "" });
  const [registerData, setRegisterData] = useState({ Name: "", Email: "", Password: "" });

  const registerLink = () => setAction("active");
  const loginLink = () => setAction("");

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok) {
        alert("Login successful!");
        handleLogin(result.user.name);
        navigate("/blog/allBlogs");
      } else {
        alert(result.error || "Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        loginLink();
      } else {
        alert(result.error || "Registration failed!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={`wrapper ${action}`}>
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={loginData.Email}
              onChange={handleLoginChange}
              required
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="Password"
              placeholder="Password"
              value={loginData.Password}
              onChange={handleLoginChange}
              required
            />
            <FaLock className="icon" />
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Don't have an account? <a href="#" onClick={registerLink}>Register</a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              name="Name"
              placeholder="Username"
              value={registerData.Name}
              onChange={handleRegisterChange}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={registerData.Email}
              onChange={handleRegisterChange}
              required
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="Password"
              placeholder="Password"
              value={registerData.Password}
              onChange={handleRegisterChange}
              required
            />
            <FaLock className="icon" />
          </div>
          <button type="submit">Register</button>
          <div className="register-link">
            <p>
              Already have an account? <a href="#" onClick={loginLink}>Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
