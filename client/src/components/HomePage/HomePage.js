//HomePage.js

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import NoteEditor from "./NoteEditors/NoteEditor";
import "../../Theme.css"; 
import "./HomePage.css";

function HomePage() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [editing, setEditing] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);

  // Mantener sincronía con el modo oscuro global
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  // Fetch notes
  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => {
        setNotes(Array.isArray(data) ? data : data.notes || []);
      })
      .catch(err => console.error("Error fetching notes:", err));
  }, []);

  // Fetch folders
  useEffect(() => {
    fetch("/api/folders")
      .then(res => res.json())
      .then(data => setFolders(data))
      .catch(err => console.error("Error fetching folders:", err));
  }, []);
  
  const createNewNote = (folderId = null) => {
    setActiveNote(null);
    setCurrentFolder(folderId);
    setEditing(true);
    setShowSidebar(false);
  };

  const saveNote = async (note) => {
    if (!note) return;

    try {
      const payload = {
        title: note.title || "Untitled Note",
        content: note.content || "",
        parentFolder: currentFolder || null,
        type: note.type || "quick"
      };

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save note");

      const savedNote = await res.json();

      // Add note to flat notes array
      

      // If it has a folder, add note to that folder locally
      if (savedNote.parentFolder?._id) {
        setFolders(prevFolders => 
          prevFolders.map(f => 
            f._id === savedNote.parentFolder._id
              ? { ...f, notes: f.notes ? [...f.notes, savedNote] : [savedNote] }
              : f
          )
        );
      }
      else {
        setNotes(prev => Array.isArray(prev) ? [...prev, savedNote] : [savedNote]);
      }

      setActiveNote(savedNote);
      setEditing(false);
      setShowSidebar(true);

      console.log("Note saved:", savedNote);

    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const openNote = (note) => {
    setActiveNote(note);
    setEditing(false);
    setShowSidebar(true);
  };

  const startEditing = () => {
    setEditing(true);
    setShowSidebar(false);
  };

  const deleteNote = async (note) => {
    try {
      await fetch(`/api/notes/${note._id}`, { method: "DELETE" });
      // Remove from flat notes list (uncategorized notes)
      setNotes(prev => prev.filter(n => n._id !== note._id));

      // Remove from its folder
      if (note.parentFolder && note.parentFolder._id) {
        setFolders(prevFolders =>
          prevFolders.map(folder =>
            folder._id === note.parentFolder._id
              ? {
                  ...folder,
                  notes: folder.notes.filter(n => n._id !== note._id)
                }
              : folder
          )
        );
      }


      // Reset UI
      setActiveNote(null);
      setEditing(false);
      setShowSidebar(true);
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setShowSidebar(true);
  };

  const createNewFolder = async (parentFolderId = null) => {
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New Folder",
          parentFolder: parentFolderId || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create folder");
      const newFolder = await res.json();

      setFolders(prev => [...prev, newFolder]);
      console.log("📁 Folder created:", newFolder);
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };


  const deleteFolder = async (folderId) => {
    try {
      await fetch(`/api/folders/${folderId}`, { method: "DELETE" });
      setFolders(prev => prev.filter(f => f._id !== folderId));
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  const filteredNotes = Array.isArray(notes)
    ? notes.filter((note) =>
        (note.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className={`layout ${darkMode ? "dark-mode" : ""}`}>
      {showSidebar && (
        <Sidebar
          notes={filteredNotes}
          folders={folders}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          createNewNote={createNewNote}
          createNewFolder={createNewFolder}
          deleteFolder={deleteFolder}
          openNote={openNote}
        />
      )}

      <div className="main-content">
        {editing ? (
          <NoteEditor
            note={activeNote}
            onSave={saveNote}
            onCancel={cancelEdit}
            onDelete={deleteNote}
          />
        ) : (
          <MainContent activeNote={activeNote} onEdit={startEditing} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
