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

        let decoded;
        try {
            decoded = JWT.verify(token, JWT_SECRET);
        } catch (error) {
            req.user = null;
            if (error instanceof JWT.JsonWebTokenError) {
                return next();
            }
            return next(error);
        }

        try {
            req.user = await User.findById(decoded.id);
            return next();
        } catch (error) {
            return next(error);
        }
    };
};

module.exports = checkCookies;
