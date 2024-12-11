import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Blog.css";

const Blog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [isSummarized, setIsSummarized] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentAnalysis, setCommentAnalysis] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:5000/blog/${id}`);
                const data = await response.json();
                setBlog(data.blog);

                const commentsResponse = await fetch(`http://localhost:5000/blog/${id}/comments`);
                const commentsData = await commentsResponse.json();
                setComments(commentsData.comments);
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };
        fetchBlog();
    }, [id]);

    const handleSummarize = async () => {
        try {
            const response = await fetch(`http://localhost:5000/blog/${id}/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                setBlog(data.blog);
                setIsSummarized(true);
            } else {
                console.error(data.error || "Error summarizing blog");
            }
        } catch (error) {
            console.error("Error summarizing blog:", error);
        }
    };

    const handleAnalyzeComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/blog/${id}/analyzeComments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                setCommentAnalysis(data.analysis);
            } else {
                console.error(data.error || "Error analyzing comments");
            }
        } catch (error) {
            console.error("Error analyzing comments:", error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/blog/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: newComment }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments([data.comment, ...comments]);
                setNewComment("");
            } else {
                console.error("Error adding comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    if (!blog) return <div>Loading...</div>;

    return (
        <div className="blog-container">
            <div className="blog-detail">
                <h1>{blog.title}</h1>
                <p>{blog.content}</p>
                <div className="blog-meta">
                    <p><strong>Author:</strong> {blog.author?.Name || "Unknown"}</p>
                    <p><strong>Email:</strong> {blog.author?.Email || "Unknown"}</p>
                    <p><strong>Created At:</strong> {new Date(blog.createdAt).toLocaleString()}</p>
                </div>
                {!isSummarized && (
                    <button onClick={handleSummarize} className="summarize-btn">
                        Summarize
                    </button>
                )}
                {isSummarized && <p>This blog has been summarized.</p>}
            </div>

            <div className="comments-section">
                <h2>Comments</h2>
                <button onClick={handleAnalyzeComments} className="analyze-btn">
                    Analyze Comments
                </button>
                {commentAnalysis && (
                    <div className="comment-analysis">
                        <strong>Analysis:</strong>
                        <p>{commentAnalysis}</p>
                    </div>
                )}
                <form onSubmit={handleAddComment}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        required
                    ></textarea>
                    <button type="submit" className="comment-btn">Post Comment</button>
                </form>
                <ul className="comments-list">
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            <p><strong>{comment.author?.Name || "Anonymous"}:</strong> {comment.content}</p>
                            <small>{new Date(comment.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Blog;
