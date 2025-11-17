// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import "./Sidebar.css";
import "../../Theme.css";

// Helper: build folder hierarchy from flat list
const buildFolderTree = (folders) => {
  const map = {};
  const roots = [];

  folders.forEach(folder => {
    map[folder._id] = { ...folder, subfolders: [] };
  });

  folders.forEach(folder => {
    if (folder.parentFolder) {
      map[folder.parentFolder]?.subfolders.push(map[folder._id]);
    } else {
      roots.push(map[folder._id]);
    }
  });

  return roots;
};

function Sidebar({ 
  notes, 
  folders, 
  searchQuery, 
  setSearchQuery, 
  createNewNote, 
  createNewFolder,
  deleteFolder,
  openNote 
}) {
  // const navigate = useNavigate();
  const [openFolders, setOpenFolders] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null); // track which folder’s + is open
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
  }, []);

  const toggleFolder = (folderId) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleAddClick = (folderId) => {
    // toggle dropdown menu
    setActiveDropdown(activeDropdown === folderId ? null : folderId);
  };

  const handleCreateInFolder = (folderId, type) => {
    // setActiveDropdown(null);
    if (type === "note") {
      createNewNote(folderId);
    } else if (type === "folder") {
      createNewFolder(folderId);
    }
    setActiveDropdown(null);
  };
  
  const uncategorizedNotes = notes.filter(n => !n.folder);
  const folderTree = buildFolderTree(folders);

  // Recursive render
  const renderFolder = (folder) => (
    <li key={folder._id} className="folder-item">
      <div className="folder-header" onClick={() => toggleFolder(folder._id)}>
        <span>{openFolders[folder._id] ? "📂" : "📁"} {folder.name}</span>
        <div className="folder-actions">
          <button className="btn-add" onClick={(e) => { e.stopPropagation(); handleAddClick(folder._id); }}>+</button>
          <button className="btn-delete" onClick={(e) => { e.stopPropagation(); deleteFolder(folder._id); }}>✕</button>
        </div>
      </div>

      {/* dropdown for + */}
      {activeDropdown === folder._id && (
        <div className="folder-dropdown" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => handleCreateInFolder(folder._id, "note")}>➕ New Note</button>
          <button onClick={() => handleCreateInFolder(folder._id, "folder")}>📁 New Folder</button>
        </div>
      )}

      {/* nested contents */}
      {openFolders[folder._id] && (
        <ul className="folder-contents">
          {folder.subfolders && folder.subfolders.map(sub => renderFolder(sub))}
          {folder.notes && folder.notes.length > 0 ? (
            folder.notes.map(note => (
              <li key={note._id} className="note-item">
                <button className="note-button" onClick={() => openNote(note)}>
                  {note.title || "Untitled"}
                </button>
              </li>
            ))
          ) : (
            <li className="empty-folder">No notes yet</li>
          )}
        </ul>
      )}
    </li>
  );

  return (
     <div className={`sidebar ${darkMode ? "dark-mode" : ""}`}>
      <div className="sidebar-header">
        <button className="btn-primary" onClick={() => createNewNote(null)}>New Note</button>
        <button className="btn-secondary" onClick={() => createNewFolder(null)}>New Folder</button>
      </div>

      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ul className="folder-list">
        {folderTree.map(folder => renderFolder(folder))}
      </ul>

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
