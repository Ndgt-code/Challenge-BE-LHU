const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middlewares/authMiddleware');

// ==========================================
// ROUTES
// ==========================================

// GET /api/uploads - Get all uploaded files
router.get('/', uploadController.getAllFiles);

// POST /api/uploads/single - Upload single file (Protected)
router.post('/single', authenticate, upload.single('file'), uploadController.uploadSingle);

// POST /api/uploads/multiple - Upload multiple files (max 5) (Protected)
router.post('/multiple', authenticate, upload.array('files', 5), uploadController.uploadMultiple);

// DELETE /api/uploads/:filename - Delete a file (Protected)
router.delete('/:filename', authenticate, uploadController.deleteFile);

module.exports = router;
