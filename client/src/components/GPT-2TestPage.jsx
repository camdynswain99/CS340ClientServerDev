// GPT-2TestPage.jsx
import React, { useState } from "react";
import axios from "axios";

function GPT2TestPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    try {
      // use relative path so CRA dev proxy (client/package.json) works in dev
      const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:latest',
        // send the prompt from state (fallback to a default summary prompt)
        prompt: prompt || 'Summarize this text...',
      }),
    });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.error('Generate error', res.status, txt);
        setResponse('Error from server: ' + (txt || res.status));
        return;
      }

      // If response is streamable, stream it; otherwise fall back to text()
      if (res.body && typeof res.body.getReader === 'function') {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        // update state incrementally so UI receives streaming updates
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setResponse(fullText);
        }
      } else {
        const txt = await res.text();
        setResponse(txt);
      }
    } catch (err) {
      console.error('handleGenerate error', err);
      setResponse('Error: ' + (err.message || err));
    }
  };

  return (
    <div>
      <h1>Ollama test page</h1>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <br />
      <button onClick={handleGenerate}>Generate</button>
      <div>
        <strong>Response:</strong>
        <pre className="llm-response">{response}</pre>
      </div>
    </div>
  );
}

export default GPT2TestPage;
