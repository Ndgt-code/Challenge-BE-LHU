// ====== EVENT LOOP ======
// Node.js xử lý code theo thứ tự ưu tiên

console.log("1️⃣ Sync - Chạy ngay");

setTimeout(() => {
    console.log("4️⃣ Macro Task (setTimeout)");
}, 0);

Promise.resolve().then(() => {
    console.log("3️⃣ Micro Task (Promise)");
});

console.log("2️⃣ Sync - Chạy ngay");

// Thứ tự: Sync → Micro Task → Macro Task
