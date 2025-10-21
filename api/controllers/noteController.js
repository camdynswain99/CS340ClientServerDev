// controllers/noteController.js
const Note = require('../models/Note');

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ lastModified: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// Create new note
exports.createNote = async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title || "Untitled Note",
      content: req.body.content ?? "", // use empty string if undefined
      folder: req.body.folder || null,
      type: req.body.type || "quick"
    });
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create note" });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Note ID is required" });
    }
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update note" });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: "Note ID is required" });
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to delete note" });
  }
};



