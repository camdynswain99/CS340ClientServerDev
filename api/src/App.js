// backend/app.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 9000;

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get("/testAPI", (req, res) => {
  res.send("Hello from the backend API!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
