// ==========================================
// UPLOAD ROUTES - File Upload Endpoints
// ==========================================

const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const uploadController = require('../controllers/uploadController');

// ==========================================
// ROUTES
// ==========================================

// GET /api/uploads - Get all uploaded files
router.get('/', uploadController.getAllFiles);

// POST /api/uploads/single - Upload single file
router.post('/single', upload.single('file'), uploadController.uploadSingle);

// POST /api/uploads/multiple - Upload multiple files (max 5)
router.post('/multiple', upload.array('files', 5), uploadController.uploadMultiple);

// DELETE /api/uploads/:filename - Delete a file
router.delete('/:filename', uploadController.deleteFile);

module.exports = router;
