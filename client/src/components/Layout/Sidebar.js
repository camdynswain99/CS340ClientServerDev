// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import "../../Theme.css";


const buildFolderTree = (folders, notes) => {
  const map = {};
  const roots = [];

  // Create lookup map
  folders.forEach(folder => {
    map[folder._id] = { ...folder, subfolders: [], notes: [] };
  });

  // attach notes to correct folder
  notes.forEach(note => {
    const parentId = note.parentFolder?._id || note.parentFolder;
    if (parentId && map[parentId]) {
      map[parentId].notes.push(note);
    }
  });

  // build folder nesting
  folders.forEach(folder => {
    const parentId = folder.parentFolder?._id || folder.parentFolder;

    if (parentId && map[parentId]) {
      map[parentId]?.subfolders.push(map[folder._id]);
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
  openNote,
  renameFolder  
}) {

  const [openFolders, setOpenFolders] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [darkMode, setDarkMode] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");
  }, []);

  const toggleFolder = (folderId) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleRenameStart = (folder) => {
    setEditingFolderId(folder._id);
    setTempName(folder.name);
  };

  const handleRenameSubmit = async (folderId) => {
    await renameFolder(folderId, tempName);
    setEditingFolderId(null);
  };

  const handleAddClick = (folderId) => {
    setActiveDropdown(activeDropdown === folderId ? null : folderId);
  };

  const handleCreateInFolder = (folderId, type) => {
    if (type === "note") {
      createNewNote(folderId);
    } else if (type === "folder") {
      createNewFolder(folderId);
    }
    setActiveDropdown(null);
  };

  const uncategorizedNotes = notes.filter(n => !n.parentFolder);

  // Build nested tree (fixed)
  const folderTree = buildFolderTree(folders, notes);

  const renderFolder = (folder) => (
    <li key={folder._id} className="folder-item">
      
      <div className="folder-header" onClick={() => toggleFolder(folder._id)}>

        <span className="folder-icon">
          {openFolders[folder._id] ? "📂" : "📁"}
        </span>

        {editingFolderId === folder._id ? (
          <input
            className="folder-rename-input"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={() => handleRenameSubmit(folder._id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit(folder._id);
            }}
            autoFocus
          />
        ) : (
          <span
            className="folder-name"
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleRenameStart(folder);
            }}
          >
            {folder.name}
          </span>
        )}

        <div className="folder-actions">
          <button
            className="btn-add"
            onClick={(e) => { 
              e.stopPropagation(); 
              handleAddClick(folder._id); 
            }}
          >
            +
          </button>

          <button
            className="btn-delete"
            onClick={(E) => { 
              E.stopPropagation();
              deleteFolder(folder._id);
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {activeDropdown === folder._id && (
        <div className="folder-dropdown" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => handleCreateInFolder(folder._id, "note")}>➕ New Note</button>
          <button onClick={() => handleCreateInFolder(folder._id, "folder")}>📁 New Folder</button>
        </div>
      )}

      {openFolders[folder._id] && (
        <ul className="folder-contents">
          {folder.subfolders?.map(sub => renderFolder(sub))}

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
