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

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const decoder = new TextDecoder();
    let buffer = '';

    for await (const chunk of ollamaRes.body) {
      buffer += decoder.decode(chunk, { stream: true });

      // Split on newlines because Ollama sends JSONL (one JSON per line)
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data = JSON.parse(line);
          if (data.response) res.write(data.response);
          if (data.done) {
            res.end();
            return;
          }
        } catch (e) {
          // Ignore incomplete/partial JSON lines
        }
      }
    }

    res.end();
  } catch (err) {
    console.error('Error proxying to Ollama API:', err);
    res.status(500).json({ message: 'Error contacting Ollama API', error: err.message });
  }
});

module.exports = router;
