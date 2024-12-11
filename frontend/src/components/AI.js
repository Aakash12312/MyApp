import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AI.css"

const CreateAI = () => {
  const [title, setTitle] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [language, setLanguage] = useState("English");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/blog/AI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, temperature, language }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/blog/editBlog/${data.blog._id}`);
      } else {
        setErrorMessage(data.error || "Failed to generate blog.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while generating the blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-ai-container">
      <h2>Create Blog with AI</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required
          />
        </label>
        <label>
          Temperature:
          <input
            type="number"
            value={temperature}
            min="0.0"
            max="1.0"
            step="0.1"
            onChange={(e) => setTemperature(e.target.value)}
            required
          />
        </label>
        <label>
          Language:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateAI;
