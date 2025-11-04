// GPT-2TestPage.jsx
import React, { useState } from "react";
import axios from "axios";

function GPT2TestPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    try {
      // Use relative path so React dev server proxy (client/package.json) forwards to the API
      const res = await axios.post("/api/generate", { prompt, model: 'llama3.2:latest' });
      console.log('generate response:', res);
      // The Flask server returns { response: text } and the API proxies that through,
      // so read `res.data.response` here.
      let raw = res.data && (res.data.response || res.data.text) ? (res.data.response || res.data.text) : JSON.stringify(res.data);

      // Helper: decode escaped sequences like "\\n" into real newlines.
      const decodeEscapes = (s) => {
        if (s == null) return '';
        // If server returned a JSON-encoded string (e.g. '"line1\\nline2"'), try JSON.parse
        if (typeof s === 'string') {
          const trimmed = s.trim();
          if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            try {
              return JSON.parse(trimmed);
            } catch (e) {
              // fallthrough
            }
          }
          // Replace common escape sequences
          return s.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
        }
        // Not a string — stringify safely
        return String(s);
      };

      setResponse(decodeEscapes(raw));
    } catch (error) {
      console.error("Error generating text", error);
      console.log("it is getting here");
    }
  };

  return (
    <div>
      <h1>GPT-2 Text Generator</h1>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <br />
      <button onClick={handleGenerate}>Generate</button>
      <div>
        <strong>Response:</strong>
        <div style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>{response}</div>
      </div>
    </div>
  );
}

export default GPT2TestPage;
