import React, { useState, useEffect } from "react";
import "../../../Theme.css"; // ✅ sube 3 niveles hasta src/Theme.css
import "./QuickNoteEditor.css";

export default function QuickNoteEditor({ note, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(note?.title || "Untitled Quick Note");
  const [content, setContent] = useState(note?.content || "");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setTitle(note?.title || "Untitled Quick Note");
    setContent(note?.content || "");

    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, [note]);

  const handleSave = () => onSave({ title, content });

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
