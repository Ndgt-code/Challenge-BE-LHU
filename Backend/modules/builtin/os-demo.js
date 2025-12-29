// ====== OS MODULE ======
// Module để lấy thông tin hệ điều hành

const os = require('os');

console.log("====== OS MODULE DEMO ======\n");

// 1. Thông tin hệ điều hành
console.log("1. THÔNG TIN HỆ ĐIỀU HÀNH:");
console.log("   - Platform:", os.platform());
console.log("   - Type:", os.type());
console.log("   - Release:", os.release());
console.log("   - Version:", os.version());
console.log("   - Architecture:", os.arch());
console.log("   - Hostname:", os.hostname());

// 2. Thông tin CPU
console.log("\n2. THÔNG TIN CPU:");
const cpus = os.cpus();
console.log("   - Số lõi:", cpus.length);
console.log("   - Model:", cpus[0].model);
console.log("   - Tốc độ:", cpus[0].speed, "MHz");

// 3. Thông tin bộ nhớ
console.log("\n3. THÔNG TIN BỘ NHỚ:");
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;

console.log("   - Tổng RAM:", formatBytes(totalMem));
console.log("   - RAM trống:", formatBytes(freeMem));
console.log("   - RAM đã dùng:", formatBytes(usedMem));
console.log("   - % đã dùng:", ((usedMem / totalMem) * 100).toFixed(2) + "%");

// 4. Thông tin User
console.log("\n4. THÔNG TIN USER:");
const userInfo = os.userInfo();
console.log("   - Username:", userInfo.username);
console.log("   - Home directory:", userInfo.homedir);
console.log("   - Shell:", userInfo.shell || "N/A (Windows)");

// 5. Thư mục hệ thống
console.log("\n5. THƯ MỤC HỆ THỐNG:");
console.log("   - Home dir:", os.homedir());
console.log("   - Temp dir:", os.tmpdir());

// 6. Network Interfaces
console.log("\n6. NETWORK INTERFACES:");
const networkInterfaces = os.networkInterfaces();
for (const [name, interfaces] of Object.entries(networkInterfaces)) {
    const ipv4 = interfaces.find(i => i.family === 'IPv4');
    if (ipv4 && !ipv4.internal) {
        console.log(`   - ${name}: ${ipv4.address}`);
    }
}

// 7. Uptime
console.log("\n7. UPTIME:");
const uptime = os.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
console.log(`   Hệ thống đã chạy: ${hours} giờ ${minutes} phút`);

// 8. Load Average (Unix only)
console.log("\n8. LOAD AVERAGE:");
const loadAvg = os.loadavg();
if (os.platform() !== 'win32') {
    console.log("   - 1 phút:", loadAvg[0].toFixed(2));
    console.log("   - 5 phút:", loadAvg[1].toFixed(2));
    console.log("   - 15 phút:", loadAvg[2].toFixed(2));
} else {
    console.log("   (Không hỗ trợ trên Windows)");
}

// 9. EOL (End of Line)
console.log("\n9. END OF LINE CHARACTER:");
console.log("   os.EOL:", JSON.stringify(os.EOL));

// 10. Priority constants
console.log("\n10. PRIORITY CONSTANTS:");
console.log("   - PRIORITY_LOW:", os.constants.priority.PRIORITY_LOW);
console.log("   - PRIORITY_NORMAL:", os.constants.priority.PRIORITY_NORMAL);
console.log("   - PRIORITY_HIGH:", os.constants.priority.PRIORITY_HIGH);

// Helper function
function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}
