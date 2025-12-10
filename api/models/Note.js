// models/Note.js

const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  type: { type: String, enum: ["quick", "class"], default: "quick" },
  subject: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
