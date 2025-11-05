import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import NoteEditor from "./NoteEditors/NoteEditor";
import "../../Theme.css"; // ✅ importa el tema global
import "./HomePage.css";

function HomePage() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [editing, setEditing] = useState(false);

  // ✅ Mantener sincronía con el modo oscuro global
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  // 🔄 Fetch inicial de notas
  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // ✏️ Crear nueva nota
  const createNewNote = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "Start writing here...",
          type: "quick",
        }),
      });

      const createdNote = await res.json();
      setNotes((prev) => [createdNote, ...prev]);
      setActiveNote(createdNote);
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

  // 💾 Guardar nota
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
      setNotes((prev) =>
        prev.map((n) => (n._id === savedNote._id ? savedNote : n))
      );
      setActiveNote(savedNote);
      setEditing(false);
      setShowSidebar(true);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  // 🗑️ Eliminar nota
  const deleteNote = async (note) => {
    try {
      await fetch(`/api/notes/${note._id}`, { method: "DELETE" });
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
    setFolders((prev) => [...prev, newFolder]);
  };

  const filteredNotes = Array.isArray(notes)
    ? notes.filter((note) =>
        (note.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div
      className={`layout ${darkMode ? "dark-mode" : ""}`}
      style={{
        display: "flex",
        marginTop: "2rem",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
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
