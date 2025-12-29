# 📚 Node.js Module System

## 🔄 CommonJS vs ES Modules

### CommonJS (Mặc định trong Node.js)
```javascript
// Export
module.exports = { myFunction, myVariable };
// hoặc
exports.myFunction = myFunction;

// Import  
const module = require('./module');
const { myFunction } = require('./module');
```

### ES Modules (Modern JavaScript)
```javascript
// Export
export const myFunction = () => {};
export default myClass;

// Import
import myClass from './module.mjs';
import { myFunction } from './module.mjs';
import * as module from './module.mjs';
```

### So sánh

| Tính năng | CommonJS | ES Modules |
|-----------|----------|------------|
| Cú pháp | `require/module.exports` | `import/export` |
| Loading | Đồng bộ | Bất đồng bộ |
| File extension | `.js` | `.mjs` hoặc `"type": "module"` |
| Top-level await | ❌ | ✅ |
| Tree shaking | ❌ | ✅ |

---

## 📁 Cấu trúc thư mục

```
modules/
├── commonjs/           # Ví dụ CommonJS
│   ├── math.js         # Module export
│   └── app.js          # Sử dụng require()
├── esmodules/          # Ví dụ ES Modules  
│   ├── math.mjs        # Module export
│   └── app.mjs         # Sử dụng import
└── builtin/            # Built-in modules
    ├── fs-demo.js      # File System
    ├── path-demo.js    # Path handling
    └── os-demo.js      # OS information
```

---

## 🚀 Chạy các demo

```bash
# CommonJS
node Backend/modules/commonjs/app.js

# ES Modules
node Backend/modules/esmodules/app.mjs

# Built-in modules
node Backend/modules/builtin/fs-demo.js
node Backend/modules/builtin/path-demo.js
node Backend/modules/builtin/os-demo.js
```

---

## 📖 Built-in Modules

### 1. `fs` - File System
- Đọc/ghi file
- Tạo/xóa thư mục
- Kiểm tra file tồn tại
- Stream files

### 2. `path` - Path Handling  
- `path.join()` - Nối đường dẫn
- `path.resolve()` - Đường dẫn tuyệt đối
- `path.basename()` - Lấy tên file
- `path.extname()` - Lấy extension

### 3. `os` - Operating System
- Thông tin CPU, RAM
- Hostname, Platform
- Network interfaces
- User information
