const express = require('express');
const mongoose = require('mongoose');

// Import Models
const User = require('../express-basic/models/User');
const Product = require('../express-basic/models/Product');

// Import Swagger
const { swaggerUi, specs } = require('./swagger');

const app = express();
const PORT = 3002;

// ==========================================
// MONGODB CONNECTION
// ==========================================
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://nguyendanggiangtruong_db_user:hE9AAqVFCB7m8VFs@cluster0.rwda16v.mongodb.net/dev?appName=Cluster0");
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
    }
};

connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(express.json());

// Swagger UI - Access: http://localhost:3002/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ==========================================
// 📝 CREATE (C) - INSERT DATA
// ==========================================

// ------------------------------------------
// 1️⃣ create() - Create 1 document
// ------------------------------------------
app.post('/api/users', async (req, res) => {
    try {
        // Method 1: Using Model.create()
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            isActive: req.body.isActive
        });

        res.status(201).json({
            message: 'User created successfully!',
            data: user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------------------------------------------
// 2️⃣ new Model() + save() - Create and save
// ------------------------------------------
app.post('/api/users/v2', async (req, res) => {
    try {
        // Method 2: Using new Model() + save()
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });

        // Can add logic before saving
        user.isActive = true;

        // Save to database
        await user.save();

        res.status(201).json({
            message: 'User created with save()!',
            data: user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------------------------------------------
// 3️⃣ insertMany() - Create multiple documents
// ------------------------------------------
app.post('/api/users/bulk', async (req, res) => {
    try {
        // req.body must be an array
        // Example: [{ name: "A", email: "a@test.com" }, { name: "B", email: "b@test.com" }]
        const users = await User.insertMany(req.body);

        res.status(201).json({
            message: `${users.length} users created!`,
            data: users
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------------------------------------------
// 4️⃣ Create Product
// ------------------------------------------
app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category
        });

        res.status(201).json({
            message: 'Product created successfully!',
            data: product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==========================================
// ✏️ UPDATE (U) - UPDATE DATA
// ==========================================

// ------------------------------------------
// 1️⃣ findByIdAndUpdate() - Update by ID
// ------------------------------------------
app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,          // ID to update
            req.body,               // New data
            {
                new: true,          // Return NEW document (after update)
                runValidators: true // Run validation
            }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User updated successfully!',
            data: user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------------------------------------------
// 2️⃣ findOneAndUpdate() - Update by condition
// ------------------------------------------
app.put('/api/users/email/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },    // Search condition
            req.body,                        // Update data
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User updated by email!',
            data: user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------------------------------------------
// 3️⃣ updateOne() - Update 1 document
// ------------------------------------------
app.patch('/api/users/:id/deactivate', async (req, res) => {
    try {
        const result = await User.updateOne(
            { _id: req.params.id },         // Condition
            { $set: { isActive: false } }   // Use $set to update specific field
        );

        res.json({
            message: 'User deactivated!',
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------------------------------------------
// 4️⃣ updateMany() - Update multiple documents
// ------------------------------------------
app.patch('/api/users/bulk/deactivate-old', async (req, res) => {
    try {
        // Deactivate all users with age > 50
        const result = await User.updateMany(
            { age: { $gt: 50 } },           // Condition
            { $set: { isActive: false } }   // Update
        );

        res.json({
            message: 'Old users deactivated!',
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------------------------------------------
// 5️⃣ Update with $inc, $push, $pull
// ------------------------------------------

// $inc - Increase/decrease numeric value
app.patch('/api/products/:id/increase-stock', async (req, res) => {
    try {
        const amount = req.body.amount || 1;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { stock: amount } },    // Increase stock by amount
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: `Stock increased by ${amount}!`,
            data: product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// $inc - Decrease value (use negative number)
app.patch('/api/products/:id/decrease-stock', async (req, res) => {
    try {
        const amount = req.body.amount || 1;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { stock: -amount } },   // Decrease stock by amount
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: `Stock decreased by ${amount}!`,
            data: product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product updated successfully!',
            data: product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==========================================
// 🗑️ DELETE (D) - DELETE DATA
// ==========================================

// ------------------------------------------
// 1️⃣ findByIdAndDelete() - Delete by ID
// ------------------------------------------
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User deleted successfully!',
            deletedUser: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 2️⃣ findOneAndDelete() - Delete by condition
// ------------------------------------------
app.delete('/api/users/email/:email', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            email: req.params.email
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User deleted by email!',
            deletedUser: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 3️⃣ deleteOne() - Delete 1 document
// ------------------------------------------
app.delete('/api/products/one/:id', async (req, res) => {
    try {
        const result = await Product.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product deleted!',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 4️⃣ deleteMany() - Delete multiple documents
// ------------------------------------------
app.delete('/api/users/bulk/inactive', async (req, res) => {
    try {
        // Delete all inactive users
        const result = await User.deleteMany({ isActive: false });

        res.json({
            message: 'Inactive users deleted!',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete out of stock products
app.delete('/api/products/bulk/out-of-stock', async (req, res) => {
    try {
        const result = await Product.deleteMany({ stock: 0 });

        res.json({
            message: 'Out of stock products deleted!',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Product by ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product deleted successfully!',
            deletedProduct: product
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 📋 GET ROUTES (to view data)
// ==========================================
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json({ count: users.length, data: users });
});

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json({ count: products.length, data: products });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log('='.repeat(65));
    console.log(`🚀 CUD Examples Server: http://localhost:${PORT}`);
    console.log('='.repeat(65));

    console.log('\n📋 CREATE ROUTES:');
    console.log('   POST   /api/users              - Create user (create)');
    console.log('   POST   /api/users/v2           - Create user (new + save)');
    console.log('   POST   /api/users/bulk         - Create multiple users (insertMany)');
    console.log('   POST   /api/products           - Create product');

    console.log('\n✏️  UPDATE ROUTES:');
    console.log('   PUT    /api/users/:id          - Update user by ID');
    console.log('   PUT    /api/users/email/:email - Update user by email');
    console.log('   PATCH  /api/users/:id/deactivate - Deactivate user');
    console.log('   PATCH  /api/users/bulk/deactivate-old - Deactivate users > 50 years old');
    console.log('   PATCH  /api/products/:id/increase-stock - Increase stock');
    console.log('   PATCH  /api/products/:id/decrease-stock - Decrease stock');
    console.log('   PUT    /api/products/:id       - Update product');

    console.log('\n🗑️  DELETE ROUTES:');
    console.log('   DELETE /api/users/:id          - Delete user by ID');
    console.log('   DELETE /api/users/email/:email - Delete user by email');
    console.log('   DELETE /api/users/bulk/inactive - Delete all inactive users');
    console.log('   DELETE /api/products/one/:id   - Delete product (deleteOne)');
    console.log('   DELETE /api/products/:id       - Delete product');
    console.log('   DELETE /api/products/bulk/out-of-stock - Delete out of stock products');

    console.log('\n📖 GET ROUTES (view data):');
    console.log('   GET    /api/users              - View all users');
    console.log('   GET    /api/products           - View all products');
    console.log('\n');
});
