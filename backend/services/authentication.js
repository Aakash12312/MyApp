const JWT = require('jsonwebtoken');
const { getJwtSecret } = require('../utils/config');
const JWT_SECRET = getJwtSecret();

function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.Email,
        role: user.roles,
        name: user.Name,
    };
    const token = JWT.sign(payload, JWT_SECRET);
    return token;
}

function verifyToken(token) {
    try {
        const decoded = JWT.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
