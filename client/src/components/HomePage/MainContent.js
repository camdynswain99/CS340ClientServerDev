import React from "react";
import './MainContent.css';

function MainContent({ activeNote, onEdit }) {
  if (!activeNote) {
    return (
      <div className="main-content-container empty">
        <p>Select a note to view its content</p>
      </div>
    );
  }

  return (
    <div className="main-content-container">
      <button className="main-content-edit-btn" onClick={onEdit}>
        Edit
      </button>

      <h2>{activeNote.title}</h2>
      <p>{activeNote.content || "This note is empty."}</p>
    </div>
  );
}

export default MainContent;
