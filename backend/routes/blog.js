const { Router } = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');
const { enhanceContent } = require('../util/Groq');
const { summarizeContent } = require('../util/Groq');
const router = Router();

// Fetch all users
router.post('/addBlog', async (req, res) => {
    const { title, content } = req.body;
    const author = req.user._id; // Assuming `req.user` is populated via middleware

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }

    try {
        const blog = await Blog.create({
            title,
            content,
            author,
        });
        return res.status(201).json(blog); // Return the created blog
    } catch (error) {
        console.error("Error while creating blog:", error);
        return res.status(500).json({ error: 'An error occurred while creating the blog.' });
    }
});


// Fetch all blogs by the current user
router.get("/yourBlogs", async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id }).populate('author');
        res.json({ user: req.user, blogs, error: null });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ user: req.user, blogs: [], error: "Failed to load your blogs." });
    }
});

// Summarize a specific blog
router.post('/:id/summarize', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author');
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found.' });
        }

        const summarizedContent = await summarizeContent(blog.content);
        res.json({ blog: { ...blog.toObject(), content: summarizedContent }, isSummarized: true });
    } catch (error) {
        console.error('Error summarizing blog:', error);
        res.status(500).json({ error: 'Failed to summarize the blog.' });
    }
});

// Fetch a specific blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("author");
        if (!blog) {
            return res.status(404).json({ error: "Blog not found." });
        }
        res.json({ blog, isSummarized: !!blog.isSummarized });
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ error: "Failed to load the blog." });
    }
});

// AI-generated blog creation
router.post('/AI', async (req, res) => {
    const { title, temperature, language } = req.body;
    try {
        const enhancedPrompt = `Write a blog in ${language} based on the title: ${title}`;
        let content = await enhanceContent(enhancedPrompt, parseFloat(temperature));
        content = content.replace(/\*/g, " ");

        const blog = await Blog.create({
            title,
            content,
            author: req.user._id,
        });

        res.status(201).json({ message: "Blog created successfully.", blog });
    } catch (error) {
        console.error("Error while creating blog:", error);
        res.status(500).json({ error: 'An error occurred while creating the blog.' });
    }
});

// Manually created blog
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    const author = req.user._id;

    if (!title || !content || !author) {
        return res.status(400).json({ error: 'Title, content, and author are required.' });
    }

    try {
        const blog = await Blog.create({ title, content, author });
        res.status(201).json({ message: "Blog created successfully.", blog });
    } catch (error) {
        console.error("Error while creating blog:", error);
        res.status(500).json({ error: 'An error occurred while creating the blog.' });
    }
});

module.exports = router;
