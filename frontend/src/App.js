import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "../src/components/Header";
import Login from "../src/components/Login";
import Profile from "../src/components/Profile";
import HeroSection from "../src/components/HeroSection";
import AddBlog from "./components/Addblog";
import CreateAI from "./components/AI";
import AllBlogs from "./components/AllBlogs";
import Blog from "./components/Blog";
import YourBlogs from "./components/YourBlogs";
import SearchUser from "./components/SearchUser";
import EditBlog from "./components/EditBlog";
import UserBlogs from "./components/UserBlogs";
import TeamPage from "./components/TeamPage";
import "./App.css";

const AppContent = ({ isLoggedIn, setIsLoggedIn, userName, setUserName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/user/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUserName("");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        navigate('/blog/allBlogs');
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("userName", name);
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} userName={userName} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/aboutus" element={<TeamPage />} />
        <Route path="/blog/yourBlogs" element={<YourBlogs />} />
        <Route path="/blog/editBlog/:id" element={<EditBlog />} />
        <Route path="/blog/addBlog" element={<AddBlog />} />
        <Route path="/blog/AllBLogs" element={<AllBlogs />} />
        <Route path="/blog/AI" element={<CreateAI />} />
        <Route path="/user/:userId/blogs" element={<UserBlogs />} />
        <Route path="/user/search" element={<SearchUser />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/user/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/user/profile" element={isLoggedIn ? <Profile userName={userName} /> : <div>Please log in</div>} />
      </Routes>
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const name = localStorage.getItem("userName");

    if (loggedIn && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userName={userName}
        setUserName={setUserName}
      />
    </Router>
  );
};

export default App;
