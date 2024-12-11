import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./YourBlogs.css";

const YourBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/blog/yourBlogs", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
        if (data && data.blogs) {
          setBlogs(data.blogs);
        } else {
          alert("No blogs found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user blogs:", error);
        alert("Failed to load blogs. Please try again.");
      });
  }, [navigate]);

  const deleteBlog = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      fetch(`http://localhost:5000/blog/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            alert("Blog deleted successfully.");
            setBlogs(blogs.filter((blog) => blog._id !== id));
          } else {
            alert("Failed to delete the blog.");
          }
        })
        .catch((error) => console.error("Error deleting blog:", error));
    }
  };

  return (
    <div className="your-blogs-container">
      <h1>Your Blogs</h1>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <h2>{blog.title}</h2>
            <p>{blog.content.substring(0, 100)}...</p>
            <button onClick={() => navigate(`/blog/${blog._id}`)}>Read More</button>
            <button onClick={() => navigate(`/blog/editBlog/${blog._id}`)} className="update-btn">
              Edit
            </button>
            <button onClick={() => deleteBlog(blog._id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>You have not created any blogs yet.</p>
      )}
    </div>
  );
};

export default YourBlogs;
