import React, { useState, useEffect } from "react";
import "../../../Theme.css"; // ✅ sube 3 niveles hasta src/Theme.css
import "./QuickNoteEditor.css";

export default function QuickNoteEditor({ note, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(note?.title || "Untitled Quick Note");
  const [content, setContent] = useState(note?.content || "");
  const [darkMode, setDarkMode] = useState(false);
  const [formatting, setFormatting] = useState(false);

  useEffect(() => {
    setTitle(note?.title || "Untitled Quick Note");
    setContent(note?.content || "");

    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, [note]);

  const handleSave = () => onSave({ title, content });

  const handleFormat = async () => {
    try {
      setFormatting(true);
      const prompt =
        "Format these notes with bullets, indents, and line spaces where needed. Do not add any information and respond with the formatted notes only:\n\n" +
        content;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3.2:latest", prompt }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Format error", res.status, txt);
        return;
      }

      const json = await res.json().catch(() => null);
      if (json && typeof json.response === "string") {
        setContent(json.response);
      } else {
        const txt = json ? JSON.stringify(json) : await res.text().catch(() => "");
        setContent(txt);
      }
    } catch (err) {
      console.error("handleFormat error", err);
    } finally {
      setFormatting(false);
    }
  };

  return (
    <div
      className={`quick-editor-container ${darkMode ? "dark-mode" : ""}`}
      style={{
        backgroundColor: "var(--panel-bg)",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        boxShadow: "0 8px 25px var(--shadow-color)",
        transition: "all 0.3s ease",
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="quick-editor-title"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your quick note..."
        className="quick-editor-textarea"
      />

      <div className="quick-editor-buttons">
        <button className="format-btn" onClick={handleFormat} disabled={formatting}>
          {formatting ? "Formatting..." : "Format"}
        </button>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="delete-btn" onClick={() => onDelete(note)}>
          Delete
        </button>
      </div>
    </div>
  );
}
