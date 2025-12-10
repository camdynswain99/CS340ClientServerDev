// src/api/notesApi.js

export const getNotesApi = async () => {
  const res = await fetch("/api/notes", {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

export const createNoteApi = async (note) => {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
};

export const updateNoteApi = async (id, note) => {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
};

export const deleteNoteApi = async (id) => {
  const res = await fetch(`/api/notes/${id}`, { 
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
};
