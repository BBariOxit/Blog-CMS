# 📊 THÔNG TIN VỀ DATABASE

## 🗄️ Cấu trúc Database

**Database Name:** `paperpress`  
**Database Type:** MongoDB (NoSQL)  
**Connection String:** `mongodb://localhost:27017/paperpress`

---

## 📋 Collections (Bảng)

### 1. **users** - Người dùng

```javascript
{
  _id: ObjectId,
  name: String,           // Tên người dùng
  email: String,          // Email (unique)
  password: String,       // Password đã hash (bcrypt)
  role: String,           // Vai trò: "author", "editor", "admin"
  createdAt: Date,        // Ngày tạo
  updatedAt: Date         // Ngày cập nhật
}
```

**Indexes:**

- email: unique index
- role: index

### 2. **posts** - Bài viết

```javascript
{
  _id: ObjectId,
  title: String,          // Tiêu đề bài viết
  slug: String,           // URL-friendly slug (unique)
  content: String,        // Nội dung Markdown gốc
  contentHtml: String,    // HTML đã render (từ Decorator Pattern)
  excerpt: String,        // Tóm tắt
  coverImage: String,     // URL ảnh bìa
  tags: [String],         // Danh sách tags
  author: ObjectId,       // Ref -> users._id
  status: String,         // "draft" hoặc "published"
  views: Number,          // Lượt xem (default: 0)
  likes: Number,          // Lượt thích (default: 0)
  readingTime: Number,    // Thời gian đọc (phút)
  publishedAt: Date,      // Ngày xuất bản
  createdAt: Date,        // Ngày tạo
  updatedAt: Date         // Ngày cập nhật
}
```

**Indexes:**

- slug: unique index
- author: index
- status: index
- tags: index
- publishedAt: index
- views: descending index (for trending)

### 3. **comments** - Bình luận

```javascript
{
  _id: ObjectId,
  post: ObjectId,         // Ref -> posts._id
  content: String,        // Nội dung bình luận
  author: String,         // Tên người comment (có thể anonymous)
  createdAt: Date,        // Ngày tạo
  updatedAt: Date         // Ngày cập nhật
}
```

**Indexes:**

- post: index
- createdAt: descending index

---

## 🔧 Scripts

### **seed.js** - Khởi tạo dữ liệu mẫu

**Chức năng:**

- Xóa toàn bộ dữ liệu cũ (nếu có)
- Tạo 2 users mẫu:
  - Author: `author@example.com` / `password`
  - Editor: `editor@example.com` / `password`
- Tạo 8 posts mẫu (6 published, 2 draft)
- Tạo comments ngẫu nhiên cho các bài viết

**Cách chạy:**

```bash
cd server
npm run seed
```

---

## 📈 Quan hệ giữa các Collections

```
users (1) ----< (N) posts
posts (1) ----< (N) comments
```

**Giải thích:**

- 1 user có thể có nhiều posts (1-N)
- 1 post có thể có nhiều comments (1-N)

---

## 🔐 Bảo mật

### Password Hashing

- Sử dụng **bcrypt** với salt rounds = 10
- Password không bao giờ lưu dưới dạng plain text

### Authentication

- JWT (JSON Web Token) với expire time: 7 ngày
- Token được gửi qua HTTP Header: `Authorization: Bearer <token>`

---

## 🚀 Migrations & Updates

### Migration Scripts (trong server/src/utils/)

1. **migrateExcerpts.js** - Tạo excerpt tự động cho posts cũ
2. **updateCoverImages.js** - Cập nhật cover images cho posts

**Cách chạy:**

```bash
cd server
npm run migrate:excerpts
npm run migrate:images
```

---

## 📊 Sample Data Statistics

Sau khi chạy seed.js:

- ✅ 2 Users
- ✅ 8 Posts (6 published, 2 drafts)
- ✅ ~10-20 Comments (random)
- ✅ Tags: javascript, react, nodejs, mongodb, webdev, tutorial

---

## 💡 Lưu ý quan trọng

1. **MongoDB phải được khởi động** trước khi chạy application
2. **Connection string** có thể thay đổi trong file `.env`
3. **Seed script** sẽ xóa toàn bộ dữ liệu cũ
4. **Indexes** được tự động tạo khi start application lần đầu

---

## 🛠️ Troubleshooting

### Lỗi kết nối MongoDB:

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Giải pháp:**

- Kiểm tra MongoDB đang chạy: `mongod --version`
- Hoặc start MongoDB với Docker: `docker-compose up -d mongodb`

### Seed script thất bại:

**Giải pháp:**

- Đảm bảo MongoDB đang chạy
- Kiểm tra connection string trong `.env`
- Xóa database cũ: `mongo paperpress --eval "db.dropDatabase()"`

---

**Ngày cập nhật:** October 27, 2025  
**Phiên bản:** 1.0.0
