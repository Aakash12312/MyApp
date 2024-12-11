import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchUser.css";

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      alert("Please enter a name to search.");
      return;
    }

    fetch(`http://localhost:5000/user/search?Name=${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          navigate("/login");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data.user) {
          setSearchResult(data.user);
          setError(null);
        } else {
          setError("User not found.");
          setSearchResult(null);
        }
      })
      .catch(() => setError("Failed to fetch user. Please try again."));
  };

  const handleViewBlogs = (userId) => {
    navigate(`/user/${userId}/blogs`);
  };

  return (
    <div className="search-user-container">
      <h2>Search for a User</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter name"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {searchResult && (
        <div className="user-info">
          <h3>User Found:</h3>
          <p><strong>Name:</strong> {searchResult.Name}</p>
          <p><strong>Email:</strong> {searchResult.Email}</p>
          <p><strong>ID:</strong> {searchResult._id}</p>
          <button onClick={() => handleViewBlogs(searchResult._id)}>
            View Blogs
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
