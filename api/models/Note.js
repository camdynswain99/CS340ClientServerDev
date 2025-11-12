const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
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
