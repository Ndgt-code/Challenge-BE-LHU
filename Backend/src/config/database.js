// ==========================================
// DATABASE CONFIGURATION
// ==========================================

const mongoose = require('mongoose');

// Database config object - frozen to prevent modifications
const databaseConfig = Object.freeze({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'dev',

    // Mongoose connection options
    options: {
        // These are default in Mongoose 6+, but explicit for clarity
        autoIndex: true,
        maxPoolSize: 10
    }
});

// ------------------------------------------
// CONNECT TO DATABASE
// ------------------------------------------
const connectDB = async () => {
    try {
        const connectionString = `${databaseConfig.uri}/${databaseConfig.name}`;

        await mongoose.connect(connectionString, databaseConfig.options);

        console.log(`✅ MongoDB connected successfully to database: ${databaseConfig.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// ------------------------------------------
// DISCONNECT FROM DATABASE
// ------------------------------------------
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error.message);
    }
};

module.exports = {
    databaseConfig,
    connectDB,
    disconnectDB
};
