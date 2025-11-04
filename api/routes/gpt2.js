const express = require('express');
const axios = require('axios');

const router = express.Router();

// Proxy POST /api/generate -> Flask GPT-2 server at http://localhost:5001/generate
router.post('/', async (req, res) => {
    //this console log helps debug incoming requests
    console.log('Received /api/generate request with body:', req.body);
  try {
    // Forward the JSON body to the Flask server
    const flaskRes = await axios.post('http://localhost:5001/generate', req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 1200000000, // in ms - model generation can take longer
    });

    // Return whatever the Flask server returned
    res.status(flaskRes.status).json(flaskRes.data);
  } catch (err) {
    // If Flask responded with an error, forward it
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    // Network/other errors
    console.error('Error proxying to GPT-2 Flask server:', err.message);
    res.status(500).json({ message: 'Error contacting GPT-2 server', error: err.message });
  }
});

module.exports = router;
