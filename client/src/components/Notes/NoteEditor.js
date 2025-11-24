// src/components/Notes/NoteEditor.js

import React, { useState, useEffect } from "react";
import QuickNoteEditor from "./QuickNoteEditor";
import ClassNoteEditor from "./ClassNoteEditor";
import "../../Theme.css"; 
import "./NoteEditor.css";
import useDarkMode from "../../hooks/useDarkMode";

function NoteEditor({ note, onSave, onCancel, onDelete }) {

  // noteType comes from the note if editing, otherwise defaults to quick
  const [noteType, setNoteType] = useState(note?.type || "quick");
  const [darkMode] = useDarkMode(); // hook usage
 
  // sync noteType whenever active note changes
  useEffect(() => {
    setNoteType(note?.type || "quick");
  }, [note]);

  // Compose full note object to send upstream
  const handleSave = (updatedData) => {
    const updatedNote = {
      ...note,
      ...updatedData,
      type: noteType,
      lastModified: new Date().toISOString(),
    };
    onSave(updatedNote);
  };

  // Delete note
  const handleDelete = () => {
    if (!note) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note);
    }
  };

  return (
    <div
      className={`note-editor-container ${darkMode ? "dark-mode" : ""}`}
      style={{
        backgroundColor: "var(--panel-bg)",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        padding: "1rem",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div className="note-editor-header">
        <h2>{note ? "Edit Note" : "New Note"}</h2>

        <div className="note-type-selector">
          <label>Type:</label>
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              padding: "0.3rem 0.5rem",
            }}
          >
            <option value="quick">Quick Note</option>
            <option value="class">Class Note</option>
          </select>
        </div>
      </div>

      <div className="note-editor-body">
        {noteType === "quick" ? (
          <QuickNoteEditor
            note={note}
            onSave={handleSave}
            onCancel={onCancel}
            onDelete={handleDelete}
          />
        ) : (
          <ClassNoteEditor
            note={note}
            onSave={handleSave}
            onCancel={onCancel}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default NoteEditor;
