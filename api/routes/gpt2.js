const express = require('express');
const router = express.Router();

//install ollama and run the command below to start the server
//ollama run llama3.2 


router.post('/', async (req, res) => {
  console.log('Received /api/generate request with body:', req.body);

  try {
    const ollamaUrl = 'http://localhost:11434/api/generate';
    const ollamaRes = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!ollamaRes.ok) {
      const text = await ollamaRes.text();
      console.error('Ollama returned non-OK status', ollamaRes.status, text);
      return res.status(ollamaRes.status).send(text);
    }

    // Ollama returns NDJSON (one JSON object per line). We'll parse the stream,
    // accumulate the `response` pieces and return a single JSON object { response: fullText }
    const decoder = new TextDecoder();
    let buffer = '';
    let full = '';

    // If body is not a stream (older Node or non-streaming), just read text
    if (!ollamaRes.body || typeof ollamaRes.body.getReader !== 'function') {
      const text = await ollamaRes.text();
      // try to parse as NDJSON (multiple lines) or single JSON
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          full += obj.response || obj.text || '';
        } catch (e) {
          // not JSON, append raw
          full += line;
        }
      }
      return res.json({ response: full });
    }

    const reader = ollamaRes.body.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep last partial line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const obj = JSON.parse(trimmed);
            full += obj.response || obj.text || '';
            if (obj.done) {
              // when done flag appears, return accumulated text
              return res.json({ response: full });
            }
          } catch (e) {
            // ignore parse errors for partial data
          }
        }
      }
      if (done) break;
    }

    // flush any remaining partial buffer
    if (buffer.trim()) {
      try {
        const obj = JSON.parse(buffer.trim());
        full += obj.response || obj.text || '';
      } catch (e) {
        full += buffer;
      }
    }

    return res.json({ response: full });
  } catch (err) {
    console.error('Error proxying to Ollama API:', err);
    res.status(500).json({ message: 'Error contacting Ollama API', error: err.message });
  }
});

module.exports = router;