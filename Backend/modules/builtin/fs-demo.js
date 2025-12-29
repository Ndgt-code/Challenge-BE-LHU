// ====== FS MODULE - File System ======
// Module để làm việc với file và thư mục

const fs = require('fs');
const path = require('path');

console.log("====== FS MODULE DEMO ======\n");

// Đường dẫn thư mục demo
const demoDir = path.join(__dirname, 'demo-files');
const demoFile = path.join(demoDir, 'test.txt');

// 1. Tạo thư mục (Synchronous)
console.log("1. Tạo thư mục...");
if (!fs.existsSync(demoDir)) {
    fs.mkdirSync(demoDir, { recursive: true });
    console.log("   ✓ Đã tạo thư mục:", demoDir);
} else {
    console.log("   ✓ Thư mục đã tồn tại");
}

// 2. Ghi file (Synchronous)
console.log("\n2. Ghi file...");
const content = `Hello từ Node.js!
Đây là nội dung file demo.
Thời gian tạo: ${new Date().toLocaleString('vi-VN')}`;

fs.writeFileSync(demoFile, content, 'utf8');
console.log("   ✓ Đã ghi file:", demoFile);

// 3. Đọc file (Synchronous)
console.log("\n3. Đọc file...");
const readContent = fs.readFileSync(demoFile, 'utf8');
console.log("   Nội dung file:");
console.log("   ---");
console.log("  ", readContent.replace(/\n/g, '\n   '));
console.log("   ---");

// 4. Thêm nội dung vào file (Append)
console.log("\n4. Thêm nội dung...");
fs.appendFileSync(demoFile, '\n\nDòng này được thêm vào!');
console.log("   ✓ Đã thêm nội dung");

// 5. Kiểm tra thông tin file (Stats)
console.log("\n5. Thông tin file...");
const stats = fs.statSync(demoFile);
console.log("   - Kích thước:", stats.size, "bytes");
console.log("   - Là file:", stats.isFile());
console.log("   - Là thư mục:", stats.isDirectory());
console.log("   - Ngày tạo:", stats.birthtime.toLocaleString('vi-VN'));

// 6. Liệt kê thư mục
console.log("\n6. Liệt kê thư mục Backend...");
const files = fs.readdirSync(path.join(__dirname, '..'));
files.forEach(file => {
    console.log("   -", file);
});

// 7. Đọc file bất đồng bộ (Asynchronous)
console.log("\n7. Đọc file bất đồng bộ...");
fs.readFile(demoFile, 'utf8', (err, data) => {
    if (err) {
        console.error("   ✗ Lỗi:", err.message);
        return;
    }
    console.log("   ✓ Đọc bất đồng bộ thành công!");
    console.log("   Số ký tự:", data.length);
});

// 8. Promises API (Modern way)
console.log("\n8. Sử dụng Promises API...");
const fsPromises = require('fs').promises;

async function readFileAsync() {
    try {
        const data = await fsPromises.readFile(demoFile, 'utf8');
        console.log("   ✓ Promise API - Đọc thành công!");
    } catch (err) {
        console.error("   ✗ Promise API - Lỗi:", err.message);
    }
}

readFileAsync();
