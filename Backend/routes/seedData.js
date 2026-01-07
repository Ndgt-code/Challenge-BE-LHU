const mongoose = require('mongoose');

// Import Models
const User = require('../express-basic/models/User');
const Product = require('../express-basic/models/Product');

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

// ==========================================
// 📦 SAMPLE DATA - 15 records total
// ==========================================

// 8 Users
const sampleUsers = [
    {
        name: "Nguyễn Văn An",
        email: "an.nguyen@test.com",
        age: 25,
        isActive: true
    },
    {
        name: "Trần Thị Bình",
        email: "binh.tran@test.com",
        age: 30,
        isActive: true
    },
    {
        name: "Lê Hoàng Cường",
        email: "cuong.le@test.com",
        age: 28,
        isActive: true
    },
    {
        name: "Phạm Minh Đức",
        email: "duc.pham@test.com",
        age: 55,
        isActive: false
    },
    {
        name: "Hoàng Thị Em",
        email: "em.hoang@test.com",
        age: 22,
        isActive: true
    },
    {
        name: "Võ Thanh Phong",
        email: "phong.vo@test.com",
        age: 45,
        isActive: true
    },
    {
        name: "Đặng Thị Giang",
        email: "giang.dang@test.com",
        age: 33,
        isActive: false
    },
    {
        name: "Bùi Quốc Hải",
        email: "hai.bui@test.com",
        age: 60,
        isActive: true
    }
];

// 7 Products
const sampleProducts = [
    {
        name: "iPhone 15 Pro Max",
        price: 29990000,
        description: "Apple iPhone 15 Pro Max 256GB",
        stock: 50,
        category: "electronics"
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        price: 25990000,
        description: "Samsung Galaxy S24 Ultra 512GB",
        stock: 35,
        category: "electronics"
    },
    {
        name: "Men's Polo Shirt",
        price: 350000,
        description: "Premium cotton polo shirt, multiple colors",
        stock: 100,
        category: "clothing"
    },
    {
        name: "Women's Jeans",
        price: 450000,
        description: "Straight leg jeans, 4-way stretch",
        stock: 80,
        category: "clothing"
    },
    {
        name: "Saigon Bread",
        price: 25000,
        description: "Traditional bread with cold cuts and vegetables",
        stock: 0,
        category: "food"
    },
    {
        name: "Laptop Dell XPS 15",
        price: 45000000,
        description: "Dell XPS 15 Core i7, 16GB RAM, 512GB SSD",
        stock: 20,
        category: "electronics"
    },
    {
        name: "Keychron K2 Mechanical Keyboard",
        price: 2500000,
        description: "Wireless mechanical keyboard, Brown switch, RGB",
        stock: 15,
        category: "other"
    }
];

// ==========================================
// 🚀 SEED FUNCTION
// ==========================================
const seedDatabase = async () => {
    try {
        await connectDB();

        // Drop old indexes that cause errors
        console.log('\n🔧 Dropping old indexes...');
        try {
            await mongoose.connection.collection('users').dropIndex('userId_1');
            console.log('   ✅ Dropped userId_1 index');
        } catch (e) {
            console.log('   ⚠️  userId_1 index not found (OK)');
        }
        try {
            await mongoose.connection.collection('products').dropIndex('productId_1');
            console.log('   ✅ Dropped productId_1 index');
        } catch (e) {
            console.log('   ⚠️  productId_1 index not found (OK)');
        }

        console.log('\n🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('   ✅ Existing data cleared!');

        console.log('\n👥 Inserting Users...');
        const users = await User.insertMany(sampleUsers);
        console.log(`   ✅ ${users.length} users inserted!`);

        console.log('\n📦 Inserting Products...');
        const products = await Product.insertMany(sampleProducts);
        console.log(`   ✅ ${products.length} products inserted!`);

        console.log('\n' + '='.repeat(50));
        console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
        console.log('='.repeat(50));

        console.log('\n📋 INSERTED USERS:');
        users.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.name} (${user.email}) - Age: ${user.age} - Active: ${user.isActive}`);
        });

        console.log('\n📦 INSERTED PRODUCTS:');
        products.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name} - ${product.price.toLocaleString('vi-VN')}đ - Stock: ${product.stock} - Category: ${product.category}`);
        });

        console.log('\n✅ Total records: ' + (users.length + products.length));
        console.log('\n💡 Now you can run: node routes/cudExamples.js');
        console.log('   And test APIs at: http://localhost:3002\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
