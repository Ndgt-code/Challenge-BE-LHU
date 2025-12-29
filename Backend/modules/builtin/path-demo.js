// ====== PATH MODULE ======
// Module để xử lý đường dẫn file/thư mục

const path = require('path');

console.log("====== PATH MODULE DEMO ======\n");

// Đường dẫn mẫu
const filePath = '/users/admin/documents/report.pdf';
const relativePath = './src/components/Button.jsx';

// 1. path.basename() - Lấy tên file
console.log("1. basename() - Lấy tên file:");
console.log("   path.basename(filePath):", path.basename(filePath));
console.log("   Không có extension:", path.basename(filePath, '.pdf'));

// 2. path.dirname() - Lấy thư mục chứa
console.log("\n2. dirname() - Lấy thư mục chứa:");
console.log("   path.dirname(filePath):", path.dirname(filePath));

// 3. path.extname() - Lấy phần mở rộng
console.log("\n3. extname() - Lấy extension:");
console.log("   path.extname(filePath):", path.extname(filePath));
console.log("   path.extname('image.png'):", path.extname('image.png'));

// 4. path.join() - Nối các đường dẫn
console.log("\n4. join() - Nối đường dẫn:");
console.log("   path.join('users', 'admin', 'docs'):", path.join('users', 'admin', 'docs'));
console.log("   path.join('/home', '../etc', 'config'):", path.join('/home', '../etc', 'config'));

// 5. path.resolve() - Tạo đường dẫn tuyệt đối
console.log("\n5. resolve() - Tạo đường dẫn tuyệt đối:");
console.log("   path.resolve('src', 'index.js'):", path.resolve('src', 'index.js'));
console.log("   path.resolve('/root', 'file.txt'):", path.resolve('/root', 'file.txt'));

// 6. path.parse() - Phân tích đường dẫn
console.log("\n6. parse() - Phân tích đường dẫn:");
const parsed = path.parse(filePath);
console.log("   Kết quả parse:");
console.log("   - root:", parsed.root);
console.log("   - dir:", parsed.dir);
console.log("   - base:", parsed.base);
console.log("   - ext:", parsed.ext);
console.log("   - name:", parsed.name);

// 7. path.format() - Tạo đường dẫn từ object
console.log("\n7. format() - Tạo đường dẫn từ object:");
const formatted = path.format({
    dir: '/home/user/documents',
    name: 'myfile',
    ext: '.txt'
});
console.log("   Kết quả:", formatted);

// 8. path.isAbsolute() - Kiểm tra đường dẫn tuyệt đối
console.log("\n8. isAbsolute() - Kiểm tra đường dẫn tuyệt đối:");
console.log("   '/var/www':", path.isAbsolute('/var/www'));
console.log("   './src':", path.isAbsolute('./src'));

// 9. path.relative() - Tính đường dẫn tương đối
console.log("\n9. relative() - Đường dẫn tương đối:");
console.log("   Từ '/home/user' đến '/home/admin':", path.relative('/home/user', '/home/admin'));

// 10. path.normalize() - Chuẩn hóa đường dẫn
console.log("\n10. normalize() - Chuẩn hóa:");
console.log("    '/home//user/../admin':", path.normalize('/home//user/../admin'));

// 11. Các thuộc tính hữu ích
console.log("\n11. Thuộc tính hệ thống:");
console.log("    path.sep (separator):", JSON.stringify(path.sep));
console.log("    path.delimiter:", JSON.stringify(path.delimiter));

// 12. __dirname và __filename
console.log("\n12. Biến đặc biệt:");
console.log("    __dirname:", __dirname);
console.log("    __filename:", __filename);
