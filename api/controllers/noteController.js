// controllers/noteController.js
const Note = require('../models/Note');
const Folder = require('../models/Folder');

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    // const notes = await Note.find({ user: req.user._id }).populate("parentFolder");
    const notes = await Note.find({ parentFolder: null });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};


// Create new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, parentFolder, type } = req.body;

    // Create the note
    const note = new Note({
      title: title || "Untitled Note",
      content: content || "",
      type: type || "quick",
      parentFolder: parentFolder || null, 
    });

    await note.save();

    // If folder provided, push the note into that folder's notes list
    if (parentFolder) {
      await Folder.findByIdAndUpdate(parentFolder, { 
        $push: { notes: note._id } 
      });
    }

    const populated = await Note.findById(note._id).populate('parentFolder', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error creating note: ", err);
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
    const { id } = req.params;

    // Find the note first
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // If the note is in a folder, remove it from that folder's notes array
    if (note.parentFolder) {
      await Folder.findByIdAndUpdate(note.parentFolder, {
        $pull: { notes: note._id },
      });
    }

    // Delete the note from the database
    await Note.findByIdAndDelete(id);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};