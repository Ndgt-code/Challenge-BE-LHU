const http = require('http');

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // Simple Routing
    if (url === '/' && method === 'GET') {
        res.statusCode = 200;
        res.end('Trang chủ');
    }
    else if (url === '/about' && method === 'GET') {
        res.statusCode = 200;
        res.end('Giới thiệu');
    }
    else if (url === '/api/users' && method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify([
            { id: 1, name: 'User A' },
            { id: 2, name: 'User B' }
        ]));
    }
    else {
        res.statusCode = 404;
        res.end('Không tìm thấy trang!');
    }
});

server.listen(3000, () => {
    console.log('🚀 Server: http://localhost:3000');
    console.log('📍 Routes: /, /about, /api/users');
});
