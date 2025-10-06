const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    const payload = { user: { id: user.id, username: user.username } };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { generateAccessToken };