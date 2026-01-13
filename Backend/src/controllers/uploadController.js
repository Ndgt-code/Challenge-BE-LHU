// ==========================================
// UPLOAD CONTROLLER - File Upload Operations
// ==========================================

const path = require('path');
const fs = require('fs');

// ==========================================
// UPLOAD SINGLE FILE
// ==========================================
const uploadSingle = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const fileInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`,
            url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        };

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: fileInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
};

// ==========================================
// UPLOAD MULTIPLE FILES
// ==========================================
const uploadMultiple = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const filesInfo = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: `/uploads/${file.filename}`,
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        }));

        res.status(200).json({
            success: true,
            message: `${req.files.length} file(s) uploaded successfully`,
            data: filesInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: error.message
        });
    }
};

// ==========================================
// DELETE FILE
// ==========================================
const deleteFile = (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Delete file
        fs.unlinkSync(filePath);

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting file',
            error: error.message
        });
    }
};

// ==========================================
// GET ALL UPLOADED FILES
// ==========================================
const getAllFiles = (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, '../../uploads');
        
        // Check if uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
            return res.status(200).json({
                success: true,
                message: 'No files found',
                data: []
            });
        }

        const files = fs.readdirSync(uploadsDir)
            .filter(file => file !== '.gitkeep')
            .map(file => {
                const filePath = path.join(uploadsDir, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    size: stats.size,
                    createdAt: stats.birthtime,
                    url: `${req.protocol}://${req.get('host')}/uploads/${file}`
                };
            });

        res.status(200).json({
            success: true,
            message: `Found ${files.length} file(s)`,
            data: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting files',
            error: error.message
        });
    }
};

module.exports = {
    uploadSingle,
    uploadMultiple,
    deleteFile,
    getAllFiles
};
