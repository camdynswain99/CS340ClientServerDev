const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function verifyToken(req, res, next) {
  const token = req.cookies?.token || null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Optionally fetch fresh user rather than trusting jwt payload:
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
module.exports = verifyToken;