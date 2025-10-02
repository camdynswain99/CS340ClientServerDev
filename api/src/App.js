// server.js (or app.js)
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');      // MongoDB connection
const authRoutes = require('./authenticationRoutes/RegistrationEndpoint');

const app = express();
const PORT = process.env.PORT || 9000;  // Use 9000 or fallback to 5000 if you want

// Connect to MongoDB
connectDB();
console.log('Testing if this is running');

// Middleware
app.use(cors());         // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Test route
app.get('/testAPI', (req, res) => {
  res.send('Hello from the backend API!');
});

// Auth routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
