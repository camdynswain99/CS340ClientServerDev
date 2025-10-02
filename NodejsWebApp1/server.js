// server/server.js or app.js
const express = require('express');
const connectDB = require('./config/db');  // DB connection
const authRoutes = require('./routes/authRoutes');  // Auth routes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
