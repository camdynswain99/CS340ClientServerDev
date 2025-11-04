// src/components/HomePage/HomePage.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import NoteEditor from "./NoteEditors/NoteEditor";
import './MainContent.css';

function HomePage() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [editing, setEditing] = useState(false);
  const [ollamaResponse, setOllamaResponse] = useState(null);
  const [ollamaLoading, setOllamaLoading] = useState(false);

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

  // Send a fixed prompt (based on the active note when available) to local Ollama server
  const queryOllama = async () => {
    const instruction = 'Format these notes with bullets, indents, and line spaces where needed. Do not add any information and respond with the formatted notes only.';
    const noteContent = activeNote && activeNote.content ? String(activeNote.content) : '';
    const fixedPrompt = noteContent ? `${instruction}\n\n${noteContent}` : `${instruction}\n\n(No note content available)`;

    const payload = {
      // adjust model name if you use a different Ollama model
      model: 'llama3.2',
      prompt: fixedPrompt,
      // Optional: request parameters depending on your Ollama setup
      // temperature: 0.7
    };

    setOllamaLoading(true);
    setOllamaResponse('');

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Ollama returned ${res.status}: ${errText}`);
      }

      // Ollama streams newline-delimited JSON (NDJSON). Read the stream and parse each line.
      if (!res.body) {
        // fallback for environments without streaming support
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          setOllamaResponse(json.response || json.text || text);
        } catch (e) {
          setOllamaResponse(text);
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      setOllamaResponse('');

      while (true) {
        const { value, done } = await reader.read();
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep last partial line in buffer
          buffer = lines.pop();
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const obj = JSON.parse(trimmed);
              const piece = obj.response || obj.text || '';
              // Append piece to response state
              setOllamaResponse(prev => (prev || '') + piece);
            } catch (e) {
              // If it's not JSON, append raw
              setOllamaResponse(prev => (prev || '') + trimmed);
            }
          }
        }
        if (done) {
          // flush remaining buffer
          if (buffer.trim()) {
            const remaining = buffer.trim();
            try {
              const obj = JSON.parse(remaining);
              setOllamaResponse(prev => (prev || '') + (obj.response || obj.text || ''));
            } catch (e) {
              setOllamaResponse(prev => (prev || '') + remaining);
            }
          }
          break;
        }
      }
    } catch (err) {
      console.error('Error calling Ollama:', err);
      setOllamaResponse('Error: ' + (err.message || String(err)));
    } finally {
      setOllamaLoading(false);
    }
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
            onQueryOllama={queryOllama}
            ollamaLoading={ollamaLoading}
            ollamaResponse={ollamaResponse}
          />
        ) : (
          <MainContent activeNote={activeNote} onEdit={startEditing} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
