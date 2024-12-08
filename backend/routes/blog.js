const { Router } = require('express');
const Blog = require('../models/blog');
const Comment = require('../models/Comment');
const checkCookies = require('../middlewares/auth');
const { enhanceContent, summarizeContent, analyzeComments } = require('../util/Groq');
const router = Router();

// Create a new blog
router.post('/addBlog', checkCookies('token'), async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }

    try {
        const author = req.user._id;
        const blog = await Blog.create({ title, content, author });
        res.status(201).json({ message: 'Blog created successfully.', blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: 'Failed to create blog.' });
    }
});

// Get all blogs
router.get('/allBlogs', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'Name Email').sort({ createdAt: -1 });
        res.json({ blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Failed to load blogs.' });
    }
});

// Generate a blog with AI
router.post('/AI', checkCookies('token'), async (req, res) => {
    const { title, temperature, language } = req.body;

    if (!title || !language) {
        return res.status(400).json({ error: 'Title and language are required.' });
    }

    try {
        const prompt = `Write a blog in ${language} with the title: ${title}`;
        const content = await enhanceContent(prompt, parseFloat(temperature || 0.7));
        const blog = await Blog.create({ title, content, author: req.user._id });

        res.status(201).json({ message: 'AI-generated blog created successfully.', blog });
    } catch (error) {
        console.error('Error creating AI blog:', error);
        res.status(500).json({ error: 'Failed to create AI blog.' });
    }
});

router.get('/yourBlogs', checkCookies('token'), async (req, res) => {
    try {
        const userId = req.user._id;
        const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
        if (!blogs.length) {
            return res.status(404).json({ message: 'No blogs found for this user.' });
        }
        res.status(200).json({ blogs });
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        res.status(500).json({ message: 'Server error while fetching user blogs.' });
    }
});

// Get blogs by a specific user
router.get('/:userId/blogs', async (req, res) => {
    const { userId } = req.params;
    try {
        const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
        if (!blogs.length) {
            return res.status(404).json({ message: 'No blogs found for this user.' });
        }
        res.status(200).json({ blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error while fetching blogs.' });
    }
});

// Summarize blog content
router.post('/:id/summarize', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'Name Email');
        if (!blog) return res.status(404).json({ error: 'Blog not found.' });

        const summarizedContent = await summarizeContent(blog.content);
        res.json({ blog: { ...blog.toObject(), content: summarizedContent }, isSummarized: true });
    } catch (error) {
        console.error('Error summarizing blog:', error);
        res.status(500).json({ error: 'Failed to summarize the blog.' });
    }
});

// Add a comment to a blog
router.post('/:id/comments', checkCookies('token'), async (req, res) => {
    const { content } = req.body;
    const { id } = req.params;

    if (!content) {
        return res.status(400).json({ error: 'Comment content is required.' });
    }

    try {
        const comment = await Comment.create({
            content,
            author: req.user._id,
            blog: id,
        });

        const populatedComment = await comment.populate('author', 'Name Email');
        res.status(201).json({ message: 'Comment added successfully.', comment: populatedComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
});

// Get comments for a blog
router.get('/:id/comments', async (req, res) => {
    const { id } = req.params;

    try {
        const comments = await Comment.find({ blog: id })
            .populate('author', 'Name Email')
            .sort({ createdAt: -1 });

        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to load comments.' });
    }
});

// Analyze comments
router.post('/:id/analyzeComments', async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.id }).select('content');
        if (!comments.length) {
            return res.status(404).json({ error: 'No comments found for analysis.' });
        }

        const commentsContent = comments.map(comment => comment.content);
        console.log(commentsContent);
        const analysis = await analyzeComments(commentsContent);

        res.status(200).json({ analysis });
    } catch (error) {
        console.error('Error analyzing comments:', error);
        res.status(500).json({ error: 'Failed to analyze comments.' });
    }
});

// Get a single blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'Name Email');
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found.' });
        }
        res.json({ blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Failed to load the blog.' });
    }
});

module.exports = router;
