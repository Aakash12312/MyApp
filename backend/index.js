const express = require('express');
const path = require('node:path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { doubleCsrf } = require('csrf-csrf');
const checkCookies = require('./middlewares/auth');
const { getJwtSecret } = require('./utils/config');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const Blog = require('./models/blog');

const app = express();
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: getJwtSecret,
    getSessionIdentifier: (req) => req.cookies.token || 'anonymous',
    cookieName: 'csrf-token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    },
});

mongoose.connect('mongodb://localhost:27017/ejs')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkCookies("token"));

app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: generateCsrfToken(req, res) });
});
app.use(doubleCsrfProtection);

// API routes
app.use('/user', userRouter);
app.use('/blog', blogRouter);

// React build folder (frontend)
app.use(express.static(path.join(__dirname, 'build')));

// Root route serving blogs and user
app.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json({ user: req.user, error: null, blogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({
            user: req.user,
            blogs: [],
            error: "Failed to load blogs.",
        });
    }
});

// Fallback route for React (serves index.html for any unknown route)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
