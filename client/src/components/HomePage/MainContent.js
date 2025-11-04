import React from "react";
import './MainContent.css';

function MainContent({ activeNote, onEdit }) {
  if (!activeNote) {
    return <p>Select a note to view its content</p>;
  }

  return (
    <div className="main-content-container">
      <button className="main-content-edit-btn" onClick={onEdit}>
        Edit
      </button>

      <h2>{activeNote.title}</h2>
      <div className="note-content">{activeNote.content || "This note is empty."}</div>
    </div>
  );
}

export default MainContent;
