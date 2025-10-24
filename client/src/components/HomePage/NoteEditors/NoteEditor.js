// src/components/HomePage/NoteEditors/NoteEditor.js
import React, { useState, useEffect } from "react";

import QuickNoteEditor from "./QuickNoteEditor";
import ClassNoteEditor from "./ClassNoteEditor";

function NoteEditor({ note, onSave, onCancel, onDelete }) {
  // default to quick note if no type is defined
  const [noteType, setNoteType] = useState(note?.type || "quick");

  // Update state when switching to a different note
  useEffect(() => {
    setNoteType(note?.type || "quick");
  }, [note]);

  const handleSave = (updatedData) => {
    const updatedNote = {
      ...note,
      ...updatedData,
      type: noteType,
      lastModified: new Date().toISOString(),
    };
    onSave(updatedNote);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "1.5rem" }}>
      <h2>{note ? "Edit Note" : "New Note"}</h2>

      {/* Note Type Toggle */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: "bold" }}>Note Type: </label>
        <select
          value={noteType}
          onChange={(e) => setNoteType(e.target.value)}
          style={{
            padding: "0.4rem",
            marginLeft: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="quick">Quick Note</option>
          <option value="class">Class Note</option>
        </select>
      </div>

      {/* Render appropriate editor */}
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
  );
}

export default NoteEditor;
