const JWT = require('jsonwebtoken');
const { getJwtSecret } = require('../utils/config');
const User = require('../models/user');

// Initialize secret once; will throw if JWT_SECRET is not configured
const JWT_SECRET = getJwtSecret();

const checkCookies = (cookieName) => {
    return async (req, res, next) => {
        const token = req.cookies[cookieName];

        if (!token) {
            req.user = null;
            return next();
        }

        try {
            const decoded = JWT.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id);
            req.user = user;
            next();
        } catch (error) {
            req.user = null;
            next();
        }
    };
};

module.exports = checkCookies;
