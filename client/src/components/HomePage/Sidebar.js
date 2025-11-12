// src/components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
  const navigate = useNavigate();
  const [openFolders, setOpenFolders] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null); // track which folder’s + is open

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
    <li key={folder._id} style={{ marginBottom: "0.75rem" }}>
      <div
        onClick={() => toggleFolder(folder._id)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        <span>
          {openFolders[folder._id] ? "📂" : "📁"} {folder.name}
        </span>

        <div>
          {/* + button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddClick(folder._id);
            }}
            style={{
              background: "none",
              border: "none",
              color: "green",
              cursor: "pointer",
              fontSize: "1rem",
              marginRight: "0.25rem"
            }}
          >
            +
          </button>
          {/* delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteFolder(folder._id);
            }}
            style={{
              background: "none",
              border: "none",
              color: "red",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* dropdown for + */}
      {activeDropdown === folder._id && (
        <div
          style={{
            marginTop: "0.25rem",
            marginLeft: "1rem",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "0.5rem",
            zIndex: 10,
            position: "relative"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleCreateInFolder(folder._id, "note")}
            style={{ display: "block", width: "100%", marginBottom: "0.25rem" }}
          >
            ➕ New Note
          </button>
          <button
            onClick={() => handleCreateInFolder(folder._id, "folder")}
            style={{ display: "block", width: "100%" }}
          >
            📁 New Folder
          </button>
        </div>
      )}

      {/* nested contents */}
      {openFolders[folder._id] && (
        <ul style={{ listStyle: "none", paddingLeft: "1rem", marginTop: "0.5rem" }}>
          {/* subfolders */}
          {folder.subfolders && folder.subfolders.length > 0 && (
            folder.subfolders.map(sub => renderFolder(sub))
          )}

          {/* notes in this folder */}
          {folder.notes && folder.notes.length > 0 ? (
            folder.notes.map(note => (
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
                  {note.title || "Untitled"}
                </button>
              </li>
            ))
          ) : (
            <li style={{ color: "#777" }}>No notes yet</li>
          )}
        </ul>
      )}
    </li>
  );

  return (
    <div 
      className="sidebar" 
      style={{ 
        width: "250px", 
        padding: "1rem", 
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        height: "100vh"
        }}
      >

      {/* --- Buttons --- */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => createNewNote(null)} style={{ width: "100%" }}>New Note</button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => createNewFolder(null)} style={{ widtch: "100%" }}>Create Folder</button>
      </div>

      {/* --- Search Bar --- */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* --- Folders Section --- */}
      {/* Render the tree recursively */}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {folderTree.map(folder => renderFolder(folder))}
      </ul>

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
