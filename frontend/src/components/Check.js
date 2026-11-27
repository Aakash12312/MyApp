import React, { useEffect, useState } from "react";
import { csrfFetch } from "../api";
import { useNavigate, useParams } from "react-router-dom";

const CheckBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blog/checkBlog/${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setBlog(data.blog);
          setSuggestions(data.suggestions);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleConfirm = async () => {
    try {
      const response = await csrfFetch(`http://localhost:5000/blog/confirmBlog/${id}`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/blogs");
      } else {
        console.error("Failed to confirm blog.");
      }
    } catch (error) {
      console.error("Error confirming blog:", error);
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="check-blog-container">
      <h2>Review Your Blog</h2>
      <h3>{blog.title}</h3>
      <p>{blog.content}</p>
      <h4>Suggestions</h4>
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
      <button onClick={handleConfirm}>Confirm and Submit</button>
    </div>
  );
};

export default CheckBlog;
