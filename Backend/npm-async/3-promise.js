// ====== PROMISE ======
// Promise = Lời hứa sẽ trả kết quả trong tương lai

// Tạo Promise
const myPromise = new Promise((resolve, reject) => {
    const success = true;

    setTimeout(() => {
        if (success) {
            resolve("✅ Thành công!");
        } else {
            reject("❌ Thất bại!");
        }
    }, 1000);
});

// Sử dụng Promise với .then() .catch()
console.log("Bắt đầu...");

myPromise
    .then(result => console.log(result))
    .catch(error => console.log(error))
    .finally(() => console.log("Hoàn tất!"));

// Promise Chain
function step1() {
    return Promise.resolve("Bước 1 xong");
}

function step2(data) {
    console.log(data);
    return Promise.resolve("Bước 2 xong");
}

step1()
    .then(step2)
    .then(result => console.log(result));
