// src/components/HomePage/NoteEditors/QuickNoteEditor.js
import React, { useState, useEffect } from "react";

export default function QuickNoteEditor({ note, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(note?.title || "Untitled Quick Note");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setTitle(note?.title || "Untitled Quick Note");
    setContent(note?.content || "");
  }, [note]);

  const handleSave = () => onSave({ title, content });

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your quick note..."
        style={{ width: "100%", height: "250px", padding: "0.5rem" }}
      />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSave} style={{ marginRight: "0.5rem" }}>Save</button>
        <button onClick={onCancel} style={{ marginRight: "0.5rem" }}>Cancel</button>
        <button onClick={() => onDelete(note)}>Delete</button>
      </div>
    </div>
  );
}
