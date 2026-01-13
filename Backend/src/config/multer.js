// ==========================================
// MULTER CONFIGURATION - File Upload
// ==========================================

const multer = require('multer');
const path = require('path');

// ==========================================
// STORAGE CONFIGURATION
// ==========================================
const storage = multer.diskStorage({
    // Set destination folder for uploaded files
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    // Set filename format: timestamp-originalname
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${uniqueSuffix}-${name}${ext}`);
    }
});

// ==========================================
// FILE FILTER - Allowed file types
// ==========================================
const fileFilter = (req, file, cb) => {
    // Allowed file extensions
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP, PDF, DOC, DOCX are allowed.'), false);
    }
};

// ==========================================
// MULTER INSTANCE
// ==========================================
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

module.exports = upload;
