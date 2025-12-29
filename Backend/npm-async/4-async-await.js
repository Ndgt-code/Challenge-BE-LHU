// Giả lập API call
function fetchUser(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, name: "Nguyen Van A" });
        }, 1000);
    });
}

function fetchPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(["Bài viết 1", "Bài viết 2"]);
        }, 1000);
    });
}

// ❌ Callback Hell (khó đọc)
// fetchUser(1).then(user => {
//     fetchPosts(user.id).then(posts => {
//         console.log(posts);
//     });
// });

// ✅ Async/Await (dễ đọc)
async function getData() {
    try {
        console.log("⏳ Đang tải user...");
        const user = await fetchUser(1);
        console.log("👤 User:", user);

        console.log("⏳ Đang tải posts...");
        const posts = await fetchPosts(user.id);
        console.log("📝 Posts:", posts);

    } catch (error) {
        console.log("❌ Lỗi:", error);
    }
}

getData();
