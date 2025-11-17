import React, { useState, useEffect } from "react";
import "../Theme.css";
import "./GPT2TestPage.css";

function GPT2TestPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // 🔄 Cargar último estado guardado
  useEffect(() => {
    const savedPrompt = localStorage.getItem("gpt2_prompt");
    const savedResponse = localStorage.getItem("gpt2_response");
    if (savedPrompt) setPrompt(savedPrompt);
    if (savedResponse) setResponse(savedResponse);
  }, []);

  // 💾 Guardar automáticamente cada cambio
  useEffect(() => {
    localStorage.setItem("gpt2_prompt", prompt);
  }, [prompt]);

  useEffect(() => {
    localStorage.setItem("gpt2_response", response);
  }, [response]);

  // 🧮 Contador de caracteres
  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  const handleGenerate = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2:latest",
          prompt: prompt || "Summarize this text...",
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Generate error", res.status, txt);
        setResponse("Error from server: " + (txt || res.status));
        setLoading(false);
        return;
      }

      // Prefer JSON: our proxy now returns { response: "..." }
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        // set the inner string (fall back to stringified JSON if unexpected shape)
        setResponse(json.response ?? JSON.stringify(json));
      } else if (res.body && typeof res.body.getReader === "function") {
        // Fallback: streaming plain-text response
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setResponse(fullText);
        }
      } else {
        const txt = await res.text();
        // If it's raw JSON text, try to parse and extract .response
        try {
          const parsed = JSON.parse(txt);
          setResponse(parsed.response ?? JSON.stringify(parsed));
        } catch (e) {
          setResponse(txt);
        }
      }
    } catch (err) {
      console.error("handleGenerate error", err);
      setResponse("Error: " + (err.message || err));
    }

    setLoading(false);
  };

  return (
    <div className="gpt2-page">
      <div className="gpt2-card">
        <h1 className="gpt2-title">Ollama Test Page</h1>

        <textarea
          className="gpt2-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your prompt here..."
        />

        <div className="gpt2-charcount">
          {charCount} characters
        </div>

        <button
          className="gpt2-btn"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            "Generate"
          )}
        </button>

        <div className="gpt2-response-container">
          <h3 className="gpt2-response-title">Response:</h3>
          <pre className="gpt2-response-box">
            {response || (loading ? "Generating..." : "Waiting for response...")}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default GPT2TestPage;
