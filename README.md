# 📝 PaperPress - Modern Blog CMS

PaperPress là một ứng dụng Blog/CMS được xây dựng bằng **React (Vite)** + **Node.js/Express** + **MongoDB**, minh họa rõ ràng hai Design Pattern quan trọng:

- **🎨 Decorator Pattern** - Content Processing Pipeline
- **🎯 Strategy Pattern** - Trending Ranking System

---

## 🏗️ Kiến Trúc

### **Backend (Node.js/Express)**

```
server/
├── src/
│   ├── config/          # Singleton config
│   ├── models/          # Mongoose schemas
│   ├── services/
│   │   ├── ContentPipeline/    # Decorator Pattern
│   │   └── Trending/           # Strategy Pattern
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middlewares/     # Auth, error handling
│   └── utils/           # Helper functions
```

### **Frontend (React + Vite)**

```
client/
├── src/
│   ├── pages/           # Route components
│   ├── components/      # Reusable components
│   ├── api/             # HTTP client
│   └── store/           # State management
```

---

## 🎨 Design Patterns

### **1. Decorator Pattern - Content Pipeline**

Khi tạo/cập nhật bài viết, nội dung được xử lý qua chuỗi decorators:

```javascript
BaseProcessor → MarkdownDecorator → SanitizeDecorator
              → HighlightDecorator → ReadingTimeDecorator
```

**Files:**

- `server/src/services/ContentPipeline/BaseProcessor.js`
- `server/src/services/ContentPipeline/MarkdownDecorator.js`
- `server/src/services/ContentPipeline/SanitizeDecorator.js`
- `server/src/services/ContentPipeline/HighlightDecorator.js`
- `server/src/services/ContentPipeline/ReadingTimeDecorator.js`
- `server/src/utils/buildContent.js`

**Kết quả:**

- Markdown → HTML
- Sanitize XSS attacks
- Syntax highlighting cho code blocks
- Tính reading time (200 words/min)

### **2. Strategy Pattern - Trending Ranking**

Endpoint `/api/trending?mode=...` cho phép chọn thuật toán xếp hạng:

```javascript
TrendingContext
├── ByViewsStrategy           (mode=views)
├── ByVelocityStrategy        (mode=velocity)
└── ByWeightedEngagementStrategy (mode=weighted)
```

**Files:**

- `server/src/services/Trending/TrendingContext.js`
- `server/src/services/Trending/ByViewsStrategy.js`
- `server/src/services/Trending/ByVelocityStrategy.js`
- `server/src/services/Trending/ByWeightedEngagementStrategy.js`

**Strategies:**

- **Views**: Sắp xếp theo lượt xem
- **Velocity**: views / tuổi bài (giờ)
- **Weighted**: `views + 5×likes + 3×comments`

---

## 🚀 Cài Đặt & Chạy

### **Prerequisites**

- Node.js 18+
- MongoDB (local hoặc Docker)
- npm

### **1. Clone & Install**

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### **2. Cấu Hình Environment**

**Server** (`server/.env`):

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/paperpress
JWT_SECRET=devsecret
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Client** (`client/.env`):

```env
VITE_API_URL=http://localhost:4000/api
```

### **3. Khởi Động MongoDB**

**Option A: MongoDB Local**

```bash
mongod
```

**Option B: Docker Compose** (khuyến nghị)

```bash
docker-compose up -d
```

### **4. Seed Dữ Liệu Mẫu**

```bash
cd server
npm run seed
```

**Kết quả:**

- ✅ 2 users (author, editor)
- ✅ 8 posts (6 published, 2 draft)
- ✅ Comments ngẫu nhiên

**Tài khoản test:**

- **Author**: `author@example.com` / `password`
- **Editor**: `editor@example.com` / `password`

### **5. Chạy Ứng Dụng**

**Terminal 1 - Server:**

```bash
cd server
npm run dev
```

→ Server: http://localhost:4000

**Terminal 2 - Client:**

```bash
cd client
npm run dev
```

→ Client: http://localhost:5173

---

## 🧪 Testing

### **Unit Tests**

```bash
cd server
npm test
```

**Test Coverage:**

- ✅ Decorator Pattern - Content Pipeline
- ✅ Strategy Pattern - Trending Ranking

---

## 📡 API Endpoints

### **Auth**

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user (Bearer token)

### **Posts**

- `GET /api/posts` - Danh sách posts (filter: `q`, `tag`, `status`, `page`, `limit`)
- `GET /api/posts/:slug` - Chi tiết post (+1 view)
- `POST /api/posts` - Tạo post (Bearer, author+)
- `PUT /api/posts/:id` - Cập nhật post (Bearer)
- `PATCH /api/posts/:id/status` - Publish/unpublish (Bearer, editor+)
- `PATCH /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id` - Xóa post (Bearer)

### **Trending** (Strategy Pattern)

- `GET /api/trending?mode=views|velocity|weighted` - Top 10 trending posts

### **Comments**

- `GET /api/posts/:postId/comments` - Danh sách comments
- `POST /api/posts/:postId/comments` - Tạo comment

---

## 🎯 Features

### **Decorator Pattern Demo**

1. Tạo bài viết mới tại `/editor`
2. Viết nội dung Markdown có code blocks:

```markdown
# My Post

This is **bold** text.

\`\`\`javascript
const greeting = "Hello World";
console.log(greeting);
\`\`\`
```

3. Submit → Server xử lý qua Decorator Pipeline
4. Xem kết quả tại `/post/my-post`:
   - HTML đã render
   - Code đã highlight
   - Reading time đã tính

### **Strategy Pattern Demo**

1. Vào trang chủ `/`
2. Xem phần **🔥 Trending Posts**
3. Thay đổi dropdown **Ranking Strategy**:
   - By Views
   - By Velocity
   - By Weighted Engagement
4. Danh sách trending tự động cập nhật

---

## 📦 Tech Stack

### **Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- marked (Markdown parser)
- sanitize-html (XSS protection)
- highlight.js (Syntax highlighting)

### **Frontend**

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- highlight.js

---

## 🔒 Bảo Mật

- ✅ JWT Bearer token authentication
- ✅ Password hashing (bcrypt)
- ✅ Input sanitization (sanitize-html)
- ✅ CORS configuration
- ✅ Role-based access control (author/editor/admin)

---

## 📂 Cấu Trúc Thư Mục Đầy Đủ

```
paperpress/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── AppConfig.js
│   │   │   └── MongoClient.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Comment.js
│   │   ├── services/
│   │   │   ├── ContentPipeline/
│   │   │   │   ├── BaseProcessor.js
│   │   │   │   ├── MarkdownDecorator.js
│   │   │   │   ├── SanitizeDecorator.js
│   │   │   │   ├── HighlightDecorator.js
│   │   │   │   └── ReadingTimeDecorator.js
│   │   │   └── Trending/
│   │   │       ├── TrendingContext.js
│   │   │       ├── ByViewsStrategy.js
│   │   │       ├── ByVelocityStrategy.js
│   │   │       └── ByWeightedEngagementStrategy.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── tests/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js
│   └── package.json
└── client/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🎓 Learning Points

### **Decorator Pattern**

- Tách biệt các xử lý thành các decorator độc lập
- Dễ thêm/bớt bước xử lý mà không ảnh hưởng code cũ
- Tuân theo Open/Closed Principle

### **Strategy Pattern**

- Cho phép thay đổi thuật toán runtime
- Tách logic xếp hạng ra khỏi controller
- Dễ mở rộng thêm strategy mới

---

## 🐛 Troubleshooting

### **MongoDB Connection Error**

```bash
# Kiểm tra MongoDB đang chạy
mongod --version

# Hoặc dùng Docker
docker-compose up -d mongodb
```

### **Port Already in Use**

```bash
# Đổi port trong .env
PORT=5000  # server
VITE_PORT=5174  # client (vite.config.js)
```

### **CORS Error**

```bash
# Kiểm tra CORS_ORIGIN trong server/.env
CORS_ORIGIN=http://localhost:5173
```

---

## 📝 License

MIT

---

## 👨‍💻 Author

Created as a demonstration of Design Patterns in modern web development.

**Happy Coding! 🚀**
