// src/components/HomePage/HomePage.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import NoteEditor from "./NoteEditors/NoteEditor";

function HomePage() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [editing, setEditing] = useState(false);

  // Fetch API example
  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())  // <— parse as JSON, not text
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err)); 
  }, []);


  // Create a new note in MongoDB
  const createNewNote = async () => {
    try {
      // Send a POST request to the backend; content/title are required
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "Start writing here...", // <-- cannot be empty
          type: "quick",
        }),
      });

      const createdNote = await res.json(); // <-- This now has _id from MongoDB
      setNotes(prev => [createdNote, ...prev]); // add to state
      setActiveNote(createdNote);              // set as active note
      setEditing(true);
      setShowSidebar(false);
    } catch (err) {
      console.error("Error creating note:", err);
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

  // Save (update) note in MongoDB
  const saveNote = async (updatedNote) => {
    if (!updatedNote?._id) {
      console.error("Cannot save note: missing _id");
      return;
    }

    try {
      const res = await fetch(`/api/notes/${updatedNote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      });
      const savedNote = await res.json();
      setNotes(prev => prev.map(n => n._id === savedNote._id ? savedNote : n));
      setActiveNote(savedNote);
      setEditing(false);
      setShowSidebar(true);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  // Delete note from MongoDB
  const deleteNote = async (note) => {
    try {
      await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
      });
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
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

  const createNewFolder = () => {
    const newFolder = { id: Date.now(), name: "New Folder" };
    setFolders(prev => [...prev, newFolder]);
  };

  const filteredNotes = Array.isArray(notes)
  ? notes.filter(note => (note.title || "").toLowerCase().includes(searchQuery.toLowerCase()))
  : [];

  return (
    <div className="layout" style={{ display: "flex", marginTop: "2rem" }}>
      {showSidebar && (
        <Sidebar
          notes={filteredNotes}
          folders={folders}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          createNewNote={createNewNote}
          createNewFolder={createNewFolder}
          openNote={openNote}
        />
      )}

      <div style={{ flex: 1, padding: "2rem" }}>
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
