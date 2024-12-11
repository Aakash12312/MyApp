import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AllBlogs.css"; // Importing CSS for AllBlogs

const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("http://localhost:5000/blog/allBlogs");
                const data = await response.json();
                setBlogs(data.blogs || []);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="allblogs-container">
            <h1>All Blogs</h1>
            <div className="blog-list">
                {blogs.map((blog) => (
                    <div key={blog._id} className="blog-card">
                        <h2>{blog.title}</h2>
                        <p>{blog.content.split(" ").slice(0, 20).join(" ")}...</p>
                        <Link to={`/blog/${blog._id}`} className="read-more-button">Read More</Link>
                        <p className="blog-author">
                            <strong>Author:</strong> {blog.author?.Name || "Unknown"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllBlogs;