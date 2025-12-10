// models/Folder.js

const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  subfolders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  createdAt: { type: Date, default: Date.now }
});

const Folder = mongoose.model('Folder', FolderSchema);

module.exports = Folder;
