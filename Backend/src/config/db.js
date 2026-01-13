const mongoose = require('mongoose');
require('dotenv').config();

// ==========================================
// MONGODB CONNECTION
// ==========================================

// Get values from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'dev';

const connectDB = async () => {
    try {
        // Build connection string with database name
        const connectionString = `${MONGODB_URI}/${DB_NAME}`;

        await mongoose.connect(connectionString);
        console.log(`✅ MongoDB connected successfully to database: ${DB_NAME}`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

