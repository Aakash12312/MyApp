const { Router } = require('express');
const User = require('../models/user');
const checkCookies = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = Router();

// Middleware to check cookies and decode token
router.use(checkCookies('token'));

// Get user profile - Protected route
router.get('/profile', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    try {
        const user = req.user; // User should be set by the auth middleware after verifying token
        res.status(200).json({ user: { id: user._id, name: user.Name, email: user.Email } }); // Return user info
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to load profile' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await User.findOne({ Email });
        if (!user) {
            throw new Error('User not found');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            throw new Error('Incorrect Password');
        }

        const token = jwt.sign(
            { id: user._id, Name: user.Name, Email: user.Email, role: user.roles },
            'A@ka$h', // Secret key
            { expiresIn: '1h' } // Token expiration
        );
        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 3600000, // 1 hour
            sameSite: 'lax', // Adjust as needed
        }).status(200).json({
            token,
            user: { name: user.Name, email: user.Email },
        });

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(401).json({ error: error.message });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    const { Name, Email, Password } = req.body;

    if (!Name || !Email || !Password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10); // Hash the password
        const newUser = await User.create({ Name, Email, Password: hashedPassword });

        const token = jwt.sign(
            { id: newUser._id, Name: newUser.Name, Email: newUser.Email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }).status(201).json({
            message: 'Signup successful.',
            user: { id: newUser._id, name: newUser.Name, email: newUser.Email },
        });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ error: 'Signup failed. Please try again.' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token').status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
