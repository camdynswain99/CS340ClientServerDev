// src/components/HomePage/Sidebar.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import "../../Theme.css"; // ✅ CORREGIDO: sube dos niveles hasta src/Theme.css

function Sidebar({
  notes,
  folders,
  searchQuery,
  setSearchQuery,
  createNewNote,
  createNewFolder,
  openNote,
}) {
  const navigate = useNavigate();
  const uncategorizedNotes = notes.filter((n) => !n.folder);

  // 🔄 Detectar modo oscuro global
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
  }, []);

  return (
    <div
      className={`sidebar ${darkMode ? "dark-mode" : ""}`}
      style={{
        backgroundColor: "var(--sidebar-bg)",
        color: "var(--text-color)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <div className="sidebar-header">
        <button className="btn-primary" onClick={() => createNewNote(navigate)}>
          + New Note
        </button>
        <button className="btn-secondary" onClick={createNewFolder}>
          + New Folder
        </button>
      </div>

      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {folders.length > 0 && (
        <div className="sidebar-section">
          <h4>Folders</h4>
          <ul className="sidebar-list">
            {folders.map((f) => (
              <li key={f._id || f.id} className="sidebar-item">
                {f.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {uncategorizedNotes.length > 0 && (
        <div className="sidebar-section">
          <h4>Notes</h4>
          <ul className="sidebar-list">
            {uncategorizedNotes.map((note) => (
              <li key={note._id} className="sidebar-item">
                <button className="note-button" onClick={() => openNote(note)}>
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
