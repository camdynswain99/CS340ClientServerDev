import React, { useState, useEffect } from "react";
import "../../../Theme.css"; // ✅ sube tres niveles hasta src/Theme.css
import "./ClassNoteEditor.css";

export default function ClassNoteEditor({ note, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(note?.title || "Untitled Class Note");
  const [subject, setSubject] = useState(note?.subject || "");
  const [content, setContent] = useState(note?.content || "");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setTitle(note?.title || "Untitled Class Note");
    setSubject(note?.subject || "");
    setContent(note?.content || "");

    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, [note]);

  const handleSave = () => onSave({ title, subject, content });

  return (
    <div
      className={`class-editor-container ${darkMode ? "dark-mode" : ""}`}
      style={{
        backgroundColor: "var(--panel-bg)",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        boxShadow: "0 8px 25px var(--shadow-color)",
        transition: "all 0.3s ease",
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="class-editor-input"
      />

      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Class Subject (e.g., CS340)"
        className="class-editor-input"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your class notes..."
        className="class-editor-textarea"
      />

      <div className="class-editor-buttons">
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
