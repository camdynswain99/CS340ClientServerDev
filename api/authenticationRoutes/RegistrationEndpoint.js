const express = require('express');
const router = express.Router();
const User = require('../models/User'); // model path relative to this file
const jwt = require('jsonwebtoken');

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

    // Create JWT
    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export router so the main app can mount it at /api/auth
module.exports = router;