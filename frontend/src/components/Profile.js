import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for navigation
import "./Profile.css"; // Import the CSS file

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/user/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include credentials to send the cookie
    })
      .then((response) => {
        if (response.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.user) {
          setUserData(data.user); // Set user data
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        alert("Failed to load profile. Please log in again.");
      });
  }, [navigate]);

  if (!userData) {
    return (
      <div className="profile-card-container">
        <p className="profile-loading">Loading...</p>
      </div>
    ); // Display loading until user data is fetched
  }

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <h1>User Profile</h1>
        <p>
          <span>Name:</span> {userData.name}
        </p>
        <p>
          <span>Email:</span> {userData.email}
        </p>
        <p>
          <span>ID:</span> {userData.id}
        </p>
        <Link to="/blog/yourBlogs" className="your-blogs-link">
          View Your Blogs
        </Link>
      </div>
    </div>
  );
};

export default Profile;
