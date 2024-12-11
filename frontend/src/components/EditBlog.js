import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditBlog.css";

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/blog/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.blog) {
          setTitle(data.blog.title);
          setContent(data.blog.content);
        } else {
          alert("Blog not found.");
          navigate("/yourBlogs");
        }
      })
      .catch((error) => console.error("Error fetching blog:", error));
  }, [id, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/blog/editBlog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Blog updated successfully.");
          navigate("/blog/yourBlogs");
        } else {
          alert("Failed to update the blog.");
        }
      })
      .catch((error) => console.error("Error updating blog:", error));
  };

  return (
    <div className="edit-blog-container">
      <h1>Edit Blog</h1>
      <form onSubmit={handleUpdate}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Blog</button>
      </form>
    </div>
  );
};

export default EditBlog;
