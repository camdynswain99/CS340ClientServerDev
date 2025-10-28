// GPT-2TestPage.jsx
import React, { useState } from "react";
import axios from "axios";

function GPT2TestPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    try {
      const res = await axios.post("http://localhost:9000/api/generate", {
        prompt,
      });
      setResponse(res.data.text);
    } catch (error) {
      console.error("Error generating text", error);
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
