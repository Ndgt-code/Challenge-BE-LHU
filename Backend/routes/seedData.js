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
        console.log("✅ MongoDB connected!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

// ==========================================
// SAMPLE DATA
// ==========================================

const sampleUsers = [
    { userId: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', age: 25, isActive: true },
    { userId: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', age: 30, isActive: true },
    { userId: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', age: 22, isActive: false },
    { userId: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', age: 28, isActive: true },
    { userId: 5, name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', age: 35, isActive: false },
    { userId: 6, name: 'Võ Thị F', email: 'vothif@gmail.com', age: 19, isActive: true },
    { userId: 7, name: 'Đặng Văn G', email: 'dangvang@gmail.com', age: 45, isActive: true },
    { userId: 8, name: 'Bùi Thị H', email: 'buithih@gmail.com', age: 27, isActive: true }
];

const sampleProducts = [
    { productId: 1, name: 'iPhone 15 Pro', price: 25000000, description: 'Điện thoại Apple mới nhất', stock: 50, category: 'electronics' },
    { productId: 2, name: 'Samsung Galaxy S24', price: 20000000, description: 'Điện thoại Samsung flagship', stock: 30, category: 'electronics' },
    { productId: 3, name: 'MacBook Pro M3', price: 45000000, description: 'Laptop Apple chip M3', stock: 15, category: 'electronics' },
    { productId: 4, name: 'Áo thun Uniqlo', price: 299000, description: 'Áo thun cotton chất lượng cao', stock: 200, category: 'clothing' },
    { productId: 5, name: 'Quần jeans Levis', price: 1500000, description: 'Quần jeans nam classic', stock: 80, category: 'clothing' },
    { productId: 6, name: 'Giày Nike Air Max', price: 3500000, description: 'Giày thể thao Nike', stock: 60, category: 'clothing' },
    { productId: 7, name: 'Bánh mì sandwich', price: 25000, description: 'Bánh mì tươi ngon', stock: 100, category: 'food' },
    { productId: 8, name: 'Cà phê Trung Nguyên', price: 150000, description: 'Cà phê rang xay nguyên chất', stock: 500, category: 'food' },
    { productId: 9, name: 'Trà sữa Phúc Long', price: 45000, description: 'Trà sữa truyền thống', stock: 0, category: 'food' },
    { productId: 10, name: 'Bút bi Thiên Long', price: 5000, description: 'Bút bi mực xanh', stock: 1000, category: 'other' },
    { productId: 11, name: 'Sổ tay A5', price: 35000, description: 'Sổ tay ghi chép', stock: 300, category: 'other' },
    { productId: 12, name: 'AirPods Pro', price: 6500000, description: 'Tai nghe không dây Apple', stock: 25, category: 'electronics' }
];

// ==========================================
// SEED FUNCTION
// ==========================================

const seedData = async () => {
    try {
        await connectDB();

        // Delete old data
        console.log('\n🗑️  Đang xóa dữ liệu cũ...');
        await User.deleteMany({});
        await Product.deleteMany({});

        // Insert new data
        console.log('📝 Đang thêm Users...');
        const createdUsers = await User.insertMany(sampleUsers);
        console.log(`   ✅ Đã thêm ${createdUsers.length} users`);

        console.log('📝 Đang thêm Products...');
        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`   ✅ Đã thêm ${createdProducts.length} products`);

        // Display results
        console.log('\n' + '='.repeat(50));
        console.log('🎉 SEED DATA THÀNH CÔNG!');
        console.log('='.repeat(50));

        console.log('\n📋 USERS:');
        createdUsers.forEach((user, i) => {
            console.log(`   ${i + 1}. ${user.name} (${user.email}) - Age: ${user.age} - Active: ${user.isActive}`);
        });

        console.log('\n📋 PRODUCTS:');
        createdProducts.forEach((product, i) => {
            console.log(`   ${i + 1}. ${product.name} - ${product.price.toLocaleString()}đ - Stock: ${product.stock} - Category: ${product.category}`);
        });

        console.log('\n✅ Bây giờ bạn có thể test API trên Postman!');
        console.log('   URL: http://localhost:3001/api/users');
        console.log('   URL: http://localhost:3001/api/products\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

// Run seed
seedData();
