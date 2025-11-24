//HomePage.js

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Layout/Sidebar";
import MainContent from "../components/Layout/MainContent";
import NoteEditor from "../components/Notes/NoteEditor";

import { getNotesApi, createNoteApi, updateNoteApi, deleteNoteApi } from "../api/notesApi";
import { getFoldersApi, createFolderApi, renameFolderApi, deleteFolderApi } from "../api/foldersApi";

import useDarkMode from "../hooks/useDarkMode";
import "./HomePage.css";

function HomePage() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [editing, setEditing] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null); 
  const [darkMode] = useDarkMode();

  useEffect(()=>{  
    getNotesApi()
      .then(setNotes)
      .catch(console.error); 
    getFoldersApi()
      .then(setFolders)
      .catch(console.error); 
  },[]);
  
  const createNewNote = (folderId) => {
    setActiveNote(null);
    setCurrentFolder(folderId);
    setEditing(true);
    setShowSidebar(false);
  };

  const saveNote = async (note) => {
  if (!note) return;

  try {
    const isExisting = !!note._id;

    const payload = {
      title: note.title || "Untitled Note",
      content: note.content || "",
      parentFolder: note.parentFolder || currentFolder || null,
      type: note.type || "quick",
    };

    const saved = isExisting
      ? await updateNoteApi(note._id, payload)
      : await createNoteApi(payload);

    // update local notes correctly
    setNotes(prev => {
      if (isExisting) {
        // Update existing note
        return prev.map(n => (n._id === saved._id ? saved : n));
      } else {
        // Add new note
        return [...prev, saved];
      }
    });

    setActiveNote(saved);
    setEditing(false);
    setShowSidebar(true);

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

  const cancelEdit = () => {
    setEditing(false);
    setShowSidebar(true);
  };

  const deleteNote = async (note) => {
    try {
      await deleteNoteApi(note._id);
      setNotes(prev => prev.filter(n => n._id !== note._id));

      // Reset UI
      setActiveNote(null);
      setEditing(false);
      setShowSidebar(true);
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  }

  const createNewFolder = async (parentFolderId = null) => {
    try {
      const newFolder = await createFolderApi({
        name: "New Folder",
        parentFolder: parentFolderId
      });
      setFolders(prev => [...prev, newFolder]);
      console.log("📁 Folder created:", newFolder);
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };


  const deleteFolder = async (folderId) => {
    try {
      await deleteFolderApi(folderId);
      setFolders(prev => prev.filter(f => f._id !== folderId));
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  const renameFolder = async (folderId, newName) => {
    try {
      await renameFolderApi(folderId, newName);
      setFolders(prev => prev.map(f => f._id === folderId ? { ...f, name: newName } : f));
    } catch (err) {
      console.error("Error renaming folder:", err);
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
          renameFolder={renameFolder}
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
