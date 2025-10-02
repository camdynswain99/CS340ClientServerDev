// controllers/authController.js
const User = require('../models/User');  // User model to interact with MongoDB

// Register user function
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;  // add email here

  try {
    // Check if the user already exists by username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user with email included
    const newUser = new User({ username, email, password });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser };