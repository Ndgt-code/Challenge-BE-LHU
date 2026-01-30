// ==========================================
// MANUAL TESTING GUIDE - Review & Optimize Features
// ==========================================

console.log('🧪 Testing Review & Optimize Features...\n');

// Test 1: Health Check Endpoint
console.log('📍 Test 1: Health Check');
console.log('Run: curl http://localhost:3002/api/health');
console.log('Expected: { status: "ok", timestamp, uptime, environment }\n');

// Test 2: Security Headers
console.log('📍 Test 2: Security Headers (Helmet)');
console.log('Run: curl -I http://localhost:3002/api/health');
console.log('Expected headers:');
console.log('  - X-Content-Type-Options: nosniff');
console.log('  - X-Frame-Options: DENY');
console.log('  - Content-Security-Policy: ...\n');

// Test 3: Rate Limiting
console.log('📍 Test 3: Rate Limiting (100 req/15min)');
console.log('Run in browser console:');
console.log(`
for (let i = 0; i < 105; i++) {
  fetch('/api/health')
    .then(r => console.log(\`Request \${i+1}: \${r.status}\`));
}
`);
console.log('Expected: Request 101+ should return 429\n');

// Test 4: Compression
console.log('📍 Test 4: Response Compression');
console.log('Run: curl http://localhost:3002/api/weather/current?city=Hanoi -H "Accept-Encoding: gzip" -I');
console.log('Expected: Content-Encoding: gzip\n');

// Test 5: Error Handling
console.log('📍 Test 5: Production-Safe Error Handler');
console.log('Run: curl http://localhost:3002/api/nonexistent');
console.log('Expected (dev): { success: false, error: { message, statusCode, stack }}');
console.log('Expected (prod): { success: false, error: { message, statusCode }} (no stack)\n');

// Test 6: MongoDB Sanitization
console.log('📍 Test 6: MongoDB Sanitization');
console.log('Run: curl "http://localhost:3002/api/users?username[$ne]=null"');
console.log('Expected: $ characters should be removed from query\n');

// Test 7: Input Sanitization
console.log('📍 Test 7: Input Sanitization');
console.log('Run: curl "http://localhost:3002/api/weather/current?city=<script>alert(1)</script>"');
console.log('Expected: < > characters should be sanitized\n');

// Test 8: Request Logging
console.log('📍 Test 8: Request Logging (Check Terminal)');
console.log('Run any API request and check terminal output');
console.log('Expected: Color-coded logs with timestamp, method, status, duration\n');

console.log('✅ All tests defined! Run server with: npm run dev');
console.log('📋 Then run each test command above to verify features\n');
