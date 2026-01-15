// ==========================================
// USER CONTROLLER - Business Logic
// ==========================================

const User = require('../models/User');
const { successResponse, errorResponse, listResponse, updateManyResponse, deleteManyResponse } = require('../views/responseHelper');

// ------------------------------------------
// GET all users (with pagination, sorting, filtering, searching)
// ------------------------------------------
const getAllUsers = async (req, res) => {
    try {
        const { buildAdvancedQuery } = require('../utils/queryBuilder');

        const { data, pagination } = await buildAdvancedQuery(User, req.query, {
            searchFields: ['name', 'email'], // Fields to search in
            select: '-__v' // Exclude __v field
        });

        return res.json({
            success: true,
            message: 'Users retrieved successfully',
            data,
            pagination
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// CREATE user using Model.create()
// ------------------------------------------
const createUser = async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            isActive: req.body.isActive
        });

        return successResponse(res, 'User created successfully!', user, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// CREATE user using new Model() + save()
// ------------------------------------------
const createUserV2 = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });

        // Can add logic before saving
        user.isActive = true;

        // Save to database
        await user.save();

        return successResponse(res, 'User created with save()!', user, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// CREATE multiple users using insertMany()
// ------------------------------------------
const createBulkUsers = async (req, res) => {
    try {
        const users = await User.insertMany(req.body);
        return successResponse(res, `${users.length} users created!`, users, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// UPDATE user by ID using findByIdAndUpdate()
// ------------------------------------------
const updateUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        return successResponse(res, 'User updated successfully!', user);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// UPDATE user by email using findOneAndUpdate()
// ------------------------------------------
const updateUserByEmail = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        return successResponse(res, 'User updated by email!', user);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// DEACTIVATE user using updateOne()
// ------------------------------------------
const deactivateUser = async (req, res) => {
    try {
        const result = await User.updateOne(
            { _id: req.params.id },
            { $set: { isActive: false } }
        );

        return updateManyResponse(res, 'User deactivated!', result);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// DEACTIVATE old users (age > 50) using updateMany()
// ------------------------------------------
const deactivateOldUsers = async (req, res) => {
    try {
        const result = await User.updateMany(
            { age: { $gt: 50 } },
            { $set: { isActive: false } }
        );

        return updateManyResponse(res, 'Old users deactivated!', result);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// DELETE user by ID using findByIdAndDelete()
// ------------------------------------------
const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        return res.json({
            message: 'User deleted successfully!',
            deletedUser: user
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// DELETE user by email using findOneAndDelete()
// ------------------------------------------
const deleteUserByEmail = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            email: req.params.email
        });

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        return res.json({
            message: 'User deleted by email!',
            deletedUser: user
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// DELETE inactive users using deleteMany()
// ------------------------------------------
const deleteInactiveUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({ isActive: false });
        return deleteManyResponse(res, 'Inactive users deleted!', result.deletedCount);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    getAllUsers,
    createUser,
    createUserV2,
    createBulkUsers,
    updateUserById,
    updateUserByEmail,
    deactivateUser,
    deactivateOldUsers,
    deleteUserById,
    deleteUserByEmail,
    deleteInactiveUsers
};
