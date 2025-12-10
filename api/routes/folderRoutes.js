// routes/folderRoutes.js
const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const verifyToken = require("../middleware/verifyToken");

// Routes
router.get('/', verifyToken, folderController.getFolders);
router.post('/', verifyToken, folderController.createFolder);
router.put('/:id', verifyToken, folderController.renameFolder);
router.delete('/:id', verifyToken, folderController.deleteFolder);
router.post('/:id/note', verifyToken, folderController.addNote);

module.exports = router;
