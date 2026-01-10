// ==========================================
// AUTH CONTROLLER - Registration & Login with JWT
// ==========================================

const AuthUser = require('../models/Auth');
const { generateToken, generateRefreshToken } = require('../config/jwt');

// ------------------------------------------
// REGISTER - Create new user
// ------------------------------------------
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingEmail = await AuthUser.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Check if username already exists
        const existingUsername = await AuthUser.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        // Create new user (password will be hashed by pre-save middleware)
        const user = await AuthUser.create({
            username,
            email,
            password
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            data: user  // Password is excluded by toJSON method
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ------------------------------------------
// LOGIN - Authenticate user
// ------------------------------------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await AuthUser.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Compare password using bcrypt
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT tokens
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        const accessToken = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Login successful
        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            data: {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: '24h'
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ------------------------------------------
// GET PROFILE - Get current user info (Protected)
// Uses req.user from authenticate middleware
// ------------------------------------------
const getProfile = async (req, res) => {
    try {
        // req.user is set by authenticate middleware
        // This route is protected, so user is guaranteed to exist
        return res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully!',
            data: req.user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ------------------------------------------
// GET USER BY ID - Admin can view any user
// ------------------------------------------
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await AuthUser.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User profile retrieved!',
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ------------------------------------------
// CHANGE PASSWORD (Protected - uses JWT)
// ------------------------------------------
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user from JWT (set by authenticate middleware)
        const user = await AuthUser.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password (will be hashed by pre-save middleware)
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully!'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ------------------------------------------
// REFRESH TOKEN - Get new access token
// ------------------------------------------
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const { verifyToken } = require('../config/jwt');
        const decoded = verifyToken(refreshToken);

        // Find user
        const user = await AuthUser.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        const newAccessToken = generateToken(tokenPayload);

        return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully!',
            data: {
                accessToken: newAccessToken,
                expiresIn: '24h'
            }
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || 'Invalid refresh token'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    getUserById,
    changePassword,
    refreshToken
};
