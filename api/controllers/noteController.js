// controllers/noteController.js
const Note = require('../models/Note');
const Folder = require('../models/Folder');

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    // `verifyToken` sets `req.user.id` (not `_id`). Use that to restrict notes to the
    // authenticated user so users cannot see other users' notes.
    const notes = await Note.find({ userId: req.user.id }).populate("parentFolder");
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
      userId: req.user.id
    });

    await note.save();

    // If folder provided, push the note into that folder's notes list
    if (parentFolder) {
      await Folder.findOneAndUpdate(
        { _id: parentFolder, userId: req.user.id },
        { $push: { notes: note._id } }
      );
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
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

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
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!note)
      return res.status(404).json({ error: "Note not found" });

    // If this note belongs to a folder, remove from folder.notes array
    if (note.parentFolder) {
      await Folder.findOneAndUpdate(
        { _id: note.parentFolder, userId: req.user.id },
        { $pull: { notes: note._id } }
      );
    }

    await Note.findByIdAndDelete(note._id);

    res.json({ message: "Note deleted successfully" });

  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};