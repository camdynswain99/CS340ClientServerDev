// controllers/folderController.js
const Folder = require('../models/Folder');
const Note = require('../models/Note');

// Get all top-level folders (and optionally populate contents)
exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ parentFolder: null })
      .populate("notes")
      .populate("subfolders");
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
};

// Create a folder (top-level or subfolder)
exports.createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    const folder = new Folder({ name, parentFolder: parentFolder || null });
    await folder.save();

    // If creating a subfolder, push it into parentFolder.subfolders
    if (parentFolder) {
      await Folder.findByIdAndUpdate(parentFolder, {
        $push: { subfolders: folder._id }
      });
    }
    res.json(folder);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create folder" });
  }
};

// Add note to a folder
exports.addNote = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { title, content } = req.body;

    const note = new Note({ title, content, folder: folderId });
    await note.save();

    await Folder.findByIdAndUpdate(folderId, {
      $push: { notes: note._id }
    });

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to add note to folder" });
  }
};

// Update folder name
exports.renameFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName || newName.trim() === "") {
      return res.status(400).json({ message: "Folder name cannot be empty" });
    }

    const folder = await Folder.findByIdAndUpdate(
      id,
      { name: newName },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete folder and all nested content (optional recursive delete)
exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    // Optionally remove subfolders and notes
    const folder = await Folder.findById(id);
    if (!folder) return res.status(404).json({ error: "Folder not found" });

    // Delete all notes in this folder
    await Note.deleteMany({ _id: { $in: folder.notes } });

    // Delete all subfolders (recursively, if needed)
    await Folder.deleteMany({ parentFolder: folder._id });

    // Delete the folder itself
    await Folder.findByIdAndDelete(id);

    res.json({ message: "Folder and contents deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to delete folder" });
  }
};
