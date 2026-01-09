// ==========================================
// AUTH MODEL - User Authentication
// ==========================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ------------------------------------------
// AUTH USER SCHEMA
// ------------------------------------------
const authUserSchema = new mongoose.Schema({
    // Username
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username must not exceed 30 characters']
    },

    // Email (unique)
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },

    // Password (hashed)
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },

    // Role
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    // Account status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// ------------------------------------------
// PRE-SAVE MIDDLEWARE: Hash password before saving
// ------------------------------------------
authUserSchema.pre('save', async function () {
    // Only hash password if it's modified (or new)
    if (!this.isModified('password')) {
        return;
    }

    // Generate salt (cost factor = 10)
    const salt = await bcrypt.genSalt(10);

    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
});

// ------------------------------------------
// METHOD: Compare password for login
// ------------------------------------------
authUserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // bcrypt.compare returns true if match, false if not
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// ------------------------------------------
// METHOD: Return user data without password
// ------------------------------------------
authUserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const AuthUser = mongoose.model('AuthUser', authUserSchema);

module.exports = AuthUser;
