// controllers/authController.js
const User = require('../models/User');  // User model to interact with MongoDB

// Register user function
const registerUser = async (req, res) => {
  const { username, password } = req.body;  // Get user data from request body

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });  // Return error if user exists
    }

    // Create a new user
    const newUser = new User({ username, password });

    // Save the new user in the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });  // Return a server error if something goes wrong
  }
};

module.exports = { registerUser };