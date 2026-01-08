const mongoose = require('mongoose');

// ==========================================
// MONGODB CONNECTION
// ==========================================
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://nguyendanggiangtruong_db_user:hE9AAqVFCB7m8VFs@cluster0.rwda16v.mongodb.net/dev?appName=Cluster0");
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
