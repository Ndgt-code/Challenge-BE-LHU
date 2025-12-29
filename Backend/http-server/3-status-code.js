const http = require('http');

const server = http.createServer((req, res) => {
    const { url } = req;

    switch (url) {
        case '/success':
            res.statusCode = 200;
            res.end('✅ 200 OK');
            break;
        case '/created':
            res.statusCode = 201;
            res.end('✅ 201 Created');
            break;
        case '/bad':
            res.statusCode = 400;
            res.end('❌ 400 Bad Request');
            break;
        case '/unauthorized':
            res.statusCode = 401;
            res.end('❌ 401 Unauthorized');
            break;
        case '/error':
            res.statusCode = 500;
            res.end('💥 500 Server Error');
            break;
        default:
            res.statusCode = 404;
            res.end('❌ 404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('🚀 Server: http://localhost:3000');
    console.log('📍 Test: /success, /created, /bad, /unauthorized, /error');
});
