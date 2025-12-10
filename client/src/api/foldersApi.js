// src/api/foldersApi.js

export const getFoldersApi = async () => {
  const res = await fetch("/api/folders", {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch folders");
  return res.json();
};

export const createFolderApi = async (data) => {
  const res = await fetch("/api/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create folder");
  return res.json();
};

export const renameFolderApi = async (id, newName) => {
  const res = await fetch(`/api/folders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error("Failed to rename folder");
  return res.json();
};

export const deleteFolderApi = async (id) => {
  const res = await fetch(`/api/folders/${id}`, { 
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete folder");
  return res.json();
};
