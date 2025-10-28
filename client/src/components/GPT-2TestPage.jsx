// GPT-2TestPage.jsx
import React, { useState } from "react";
import axios from "axios";

function GPT2TestPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    try {
      // Use relative path so React dev server proxy (client/package.json) forwards to the API
      const res = await axios.post("/api/generate", { prompt });
      console.log('generate response:', res);
      // The Flask server returns { response: text } and the API proxies that through,
      // so read `res.data.response` here.
      setResponse(res.data.response || res.data.text || JSON.stringify(res.data));
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
      <p><strong>Response:</strong> {response}</p>
    </div>
  );
}

export default GPT2TestPage;
