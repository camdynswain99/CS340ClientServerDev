// src/components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ notes, folders, searchQuery, setSearchQuery, createNewNote, createNewFolder, openNote }) {
  const navigate = useNavigate();

  const uncategorizedNotes = notes.filter(n => !n.folder);

  return (
    <div className="sidebar" style={{ width: "250px", padding: "1rem", borderRight: "1px solid #ccc" }}>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => createNewNote(navigate)} style={{ width: "100%" }}>New Note</button>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <button onClick={createNewFolder} style={{ width: "100%" }}>Create Folder</button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* Folders list */}
      {folders.length > 0 && (
        <div>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {folders.map(f => (
              <li key={f._id}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Uncategorized notes */}
      {uncategorizedNotes.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {uncategorizedNotes.map(note => (
              <li key={note._id}>
                <button
                  onClick={() => openNote(note)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                    font: "inherit"
                  }}
                >
                  {note.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
