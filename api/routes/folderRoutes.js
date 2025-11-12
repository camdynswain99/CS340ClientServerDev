// routes/folderRoutes.js
const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

// Routes
router.get('/', folderController.getFolders);
router.post('/', folderController.createFolder);
router.put('/:id', folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);
router.post("/:folderId/note", folderController.addNote);

module.exports = router;
