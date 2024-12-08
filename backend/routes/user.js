const { Router } = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkCookies = require('../middlewares/auth');
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'A@ka$h';

// Login route
router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await User.findOne({ Email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

        const token = jwt.sign(
            { id: user._id, Name: user.Name, Email: user.Email, role: user.roles },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
        }).status(200).json({ token, user: { id: user._id, name: user.Name, email: user.Email } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    const { Name, Email, Password } = req.body;

    if (!Name || !Email || !Password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ Email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });
        
        const newUser = await User.create({ Name, Email, Password:Password });

        const token = jwt.sign(
            { id: newUser._id, Name: newUser.Name, Email: newUser.Email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
            .status(201)
            .json({ message: 'Signup successful.', user: { id: newUser._id, name: newUser.Name, email: newUser.Email } });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Signup failed. Please try again.' });
    }
});

// Protected route: User profile
router.get('/profile', checkCookies('token'), async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Unauthorized. Please log in.' });

        res.status(200).json({
            user: {
                id: user._id,
                name: user.Name,
                email: user.Email,
                roles: user.roles, // Ensure roles are included
            },
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to load profile.' });
    }
});


// Search user by name
router.get('/search', async (req, res) => {
    const { Name } = req.query;

    try {
        if (!Name) return res.status(400).json({ error: 'Name query parameter is required.' });

        const user = await User.findOne({ Name });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        res.json({ user }); // Ensure you're sending the user object here
    } catch (error) {
        console.error('Error searching user:', error);
        res.status(500).json({ error: 'Server error during user search.' });
    }
});


router.delete('/delete/:id', checkCookies('token'), async (req, res) => {
    try {
        const adminUser = req.user; // Extract logged-in user
        if (adminUser.role !== 'admin') {
            return res.status(403).json({ error: 'Permission denied. Only admins can delete accounts.' });
        }

        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Failed to delete user account.' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token').status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
