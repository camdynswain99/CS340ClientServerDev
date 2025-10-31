const express = require('express');
const router = express.Router();

//only for finding if Ollama is running
// Probe common Ollama model-list endpoints and return the first successful one
router.get('/models', async (req, res) => {
  const base = process.env.OLLAMA_URL || 'http://localhost:11434';
  const candidates = [
    `${base}/api/models`,
    `${base}/models`,
    `${base}/v1/models`,
    `${base}/api/v1/models`
  ];

  const errors = [];

  for (const url of candidates) {
    try {
      const r = await fetch(url, { method: 'GET' });
      const text = await r.text();
      if (r.ok) {
        // try parse JSON, otherwise return text
        try {
          const json = JSON.parse(text);
          return res.json({ endpoint: url, models: json });
        } catch (e) {
          return res.json({ endpoint: url, body: text });
        }
      } else {
        errors.push({ url, status: r.status, body: text });
      }
    } catch (err) {
      errors.push({ url, error: err.message });
    }
  }

  return res.status(502).json({ message: 'No reachable Ollama models endpoint found', attempts: errors });
});

module.exports = router;
