const http = require('http');

const server = http.createServer((req, res) => {
    // Thông tin Request
    console.log(`${req.method} ${req.url}`);

    // Response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>Hello từ Node.js Server!</h1>');
});

server.listen(3000, () => {
    console.log('🚀 Server chạy tại http://localhost:3000');
});
