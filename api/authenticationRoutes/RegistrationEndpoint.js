const express = require('express');
const router = express.Router();
const User = require('../models/User'); // model path relative to this file
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');


//This handles login, registration, logout, and getting current user info

// Secret for JWT signing - in production set process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email and password are required' });
  }

  try {
    // Prevent duplicate username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user. Password will be hashed by the User model pre-save hook
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be username or email

  // Debug logging to confirm request reaches this route
  console.log('[/api/auth/login] incoming login request:', { path: req.path, bodyPreview: JSON.stringify({ identifier: req.body.identifier }).slice(0,200) });

  if (!identifier || !password) {
    return res.status(400).json({ message: 'identifier and password are required' });
  }

  try {
    // Find by username OR email
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Makes a JWT token and sets it as an HttpOnly cookie and sends it to client
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

      // mark the cookie as secure when the original request was HTTPS.
      // When behind Cloudflare, Express with `trust proxy` will set req.secure
      // correctly; additionally check x-forwarded-proto header as a fallback.
      const isSecure = req.secure || (req.headers['x-forwarded-proto'] === 'https') || (process.env.NODE_ENV === 'production');

      res.cookie('token', token, {
        httpOnly: true,
        secure: !!isSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
      });

      // send user info only
      res.json({ user: { id: user._id, username: user.username, email: user.email } });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//logout endpoint
router.post('/logout', (req, res) => {
  const isSecure = req.secure || (req.headers['x-forwarded-proto'] === 'https') || (process.env.NODE_ENV === 'production');
  res.clearCookie('token', {
    httpOnly: true,
    secure: !!isSecure,
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out' });
});

// Middleware to verify JWT from HttpOnly cookie
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user }); // user populated by middleware
});

// Export router so the main app can mount it at /api/auth
module.exports = router;