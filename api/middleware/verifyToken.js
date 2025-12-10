// middleware/verifyToken.js

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

/**
 * Verify JWT middleware.
 * Looks for token in HttpOnly cookie `token` first, falls back to Authorization header.
 * On success sets req.user = { id, username, ... }
 */
module.exports = function verifyToken(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      req.user = { id: decoded.id, username: decoded.username };
      next();
    });
  } catch (err) {
    console.error('verifyToken error', err);
    return res.status(500).json({ message: 'Auth error' });
  }
};
