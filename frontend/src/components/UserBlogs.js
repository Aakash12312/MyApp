import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./UserBlogs.css"; // Import the CSS file

const UserBlogs = () => {
  const { userId } = useParams(); // Grab userId from URL
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blog/${userId}/blogs`);
        const data = await response.json();
        if (data.blogs) {
          setBlogs(data.blogs);
        } else {
          setError(data.message || "No blogs found.");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBlogs();
  }, [userId]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="user-blogs-container">
      <h2>User Blogs</h2>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <h3>{blog.title}</h3>
            <p>{blog.content.split("\n")[0]}</p> {/* Display only the first line */}
            <p>{blog.content.split("\n")[1]}</p> {/* Display the second line */}
            <p className="date">
              <strong>Created At:</strong> {new Date(blog.createdAt).toLocaleString()}
            </p>
            <Link to={`/blog/${blog._id}`} style={{ textDecoration: "none" }}>
              <button>Read More</button>
            </Link>
          </div>
        ))
      ) : (
        <p className="loading-message">Loading blogs...</p>
      )}
    </div>
  );
};

export default UserBlogs;
