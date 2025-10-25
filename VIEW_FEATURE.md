# Chức năng View (Lượt xem) - Hoàn thiện ✅

## Tổng quan

Chức năng view đã được implement đầy đủ và hoạt động chính xác. Mỗi lần người dùng truy cập vào một bài viết qua endpoint `GET /api/posts/:slug`, số lượt xem sẽ tự động tăng lên 1.

## Các thay đổi đã thực hiện

### 1. Controller (`server/src/controllers/posts.controller.js`)

**Hàm `getPostBySlug`** đã được cập nhật với các tính năng:

✅ **Atomic View Increment**: Sử dụng `findByIdAndUpdate` với `$inc` operator để tăng views một cách nguyên tử, tránh race condition khi có nhiều request đồng thời.

```javascript
const updated = await Post.findByIdAndUpdate(
  post._id,
  { $inc: { views: 1 } },
  { new: true }
).populate("author", "displayName email role");
```

✅ **Draft Access Control**: Chỉ author/editor/admin mới được xem bài viết draft:

- Public users: Chỉ xem được bài `published`
- Logged-in users: Xem được draft nếu là author hoặc có role editor/admin
- Trả về 404 cho draft posts với public users (không tiết lộ existence)

### 2. Routes (`server/src/routes/posts.routes.js`)

✅ Thêm middleware `optionalAuth` vào route `GET /:slug`:

```javascript
router.get("/:slug", optionalAuth, getPostBySlug);
```

Middleware này cho phép:

- Route vẫn public (không cần login bắt buộc)
- Nhưng nếu có JWT token, sẽ populate `req.user`
- Từ đó controller có thể check quyền xem draft

### 3. Model (`server/src/models/Post.js`)

✅ Model đã có sẵn field `views`:

```javascript
views: {
  type: Number,
  default: 0,
}
```

## Cách hoạt động

### Flow khi user truy cập bài viết:

1. **Request**: Frontend gọi `GET /api/posts/:slug`
2. **Middleware**: `optionalAuth` kiểm tra JWT (nếu có) và populate `req.user`
3. **Controller**:
   - Tìm post theo slug
   - Check status: nếu draft thì verify quyền truy cập
   - **Tăng views** atomically với `$inc`
   - Trả về post với views đã tăng
4. **Response**: Frontend nhận post với field `views` mới

### Ví dụ Response:

```json
{
  "_id": "68fb98349c4013793758f3df",
  "title": "Getting Started with React 18",
  "slug": "getting-started-with-react-18",
  "views": 155,  // ← Tăng lên mỗi lần request
  "likes": 23,
  "status": "published",
  ...
}
```

## Test thủ công

### Cách 1: Dùng PowerShell

```powershell
# Request 1
$post = Invoke-RestMethod -Uri "http://localhost:4001/api/posts/getting-started-with-react-18"
Write-Host "Views: $($post.views)"

# Request 2
$post = Invoke-RestMethod -Uri "http://localhost:4001/api/posts/getting-started-with-react-18"
Write-Host "Views: $($post.views)"  # Sẽ tăng lên 1
```

### Cách 2: Dùng Frontend

1. Start server: `cd server && npm run dev`
2. Start client: `cd client && npm run dev`
3. Mở trình duyệt và click vào một bài viết
4. Refresh trang → views tăng lên
5. Kiểm tra badge "👁️ {views}" trên PostCard

### Cách 3: Dùng Postman/Thunder Client

- GET `http://localhost:4001/api/posts/getting-started-with-react-18`
- Mỗi lần gửi request, field `views` trong response sẽ tăng

## Security & Performance

### ✅ Race Condition Prevention

Sử dụng MongoDB atomic operation `$inc` thay vì:

```javascript
// ❌ BAD - có race condition
post.views += 1;
await post.save();

// ✅ GOOD - atomic update
await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
```

### ✅ Draft Protection

- Draft posts không hiển thị cho public
- Không tiết lộ existence (trả 404 thay vì 403)
- Author/editor/admin vẫn xem được draft

## Frontend Integration

Frontend đã sẵn sàng hiển thị views:

### `PostCard.jsx`:

```jsx
<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg z-20">
  <span className="text-sm font-semibold text-gray-700">👁️ {post.views}</span>
</div>
```

### `PostDetail.jsx`:

```jsx
<span className="flex items-center space-x-2 text-gray-600">
  <span>👁️</span>
  <span className="font-medium">{post.views} views</span>
</span>
```

## Kết luận

✅ Chức năng view đã hoàn thiện và hoạt động đúng  
✅ Atomic increment tránh race condition  
✅ Bảo vệ draft posts với access control  
✅ Frontend đã tích hợp sẵn hiển thị  
✅ Database model đã có field cần thiết

**Không cần thay đổi gì thêm!** Chỉ cần start server và client là có thể sử dụng ngay.
