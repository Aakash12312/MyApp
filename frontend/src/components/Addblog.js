import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBlog.css"; // Import the CSS file for scoped styling

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/blog/addBlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create blog");
      }

      navigate("/blog/allBlogs");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred");
    }
  };

  return (
    <div className="add-blog-container">
      <div className="add-blog-form">
        <h2>Add a Blog</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Body</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the blog body"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
