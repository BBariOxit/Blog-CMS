# Cover Image Feature - Hoàn thành ✅

## Tổng quan

Đã thêm tính năng **ảnh bìa (cover image)** cho blog posts trong ứng dụng PaperPress.

## Các thay đổi đã thực hiện

### 1. Backend (Server)

#### Post Model (`server/src/models/Post.js`)

- ✅ Thêm field `coverImage`:

```javascript
coverImage: {
  type: String,
  default: '',
}
```

#### Posts Controller (`server/src/controllers/posts.controller.js`)

- ✅ Cập nhật `createPost`: Nhận và lưu `coverImage` từ request body
- ✅ Cập nhật `updatePost`: Cho phép cập nhật `coverImage` khi edit bài viết

#### Seed Data (`server/src/seed.js`)

- ✅ Thêm ảnh bìa mẫu từ Unsplash cho tất cả 8 bài posts:
  1. React 18: https://images.unsplash.com/photo-1633356122544-f134324a6cee
  2. MongoDB: https://images.unsplash.com/photo-1544383835-bda2bc66a55d
  3. Node.js: https://images.unsplash.com/photo-1618477388954-7852f32655ec
  4. Decorator Pattern: https://images.unsplash.com/photo-1517694712202-14dd9538aa97
  5. Strategy Pattern: https://images.unsplash.com/photo-1555066931-4365d14bab8c
  6. Express.js: https://images.unsplash.com/photo-1558494949-ef010cbdcc31
  7. CSS Grid: https://images.unsplash.com/photo-1507721999472-8ed4421c4af2
  8. Async/Await: https://images.unsplash.com/photo-1461749280684-dccba630e2f6

### 2. Frontend (Client)

#### Editor Page (`client/src/pages/Editor.jsx`)

- ✅ Thêm field `coverImage` vào form state
- ✅ Thêm input field cho Cover Image URL với:
  - Icon 🖼️
  - Placeholder cho Unsplash URL
  - Live preview khi nhập URL
  - Error handling nếu ảnh không load được
  - Gợi ý kích thước ảnh (800x400px hoặc tỷ lệ 2:1)
- ✅ Gửi `coverImage` khi tạo/cập nhật bài viết

#### PostCard Component (`client/src/components/PostCard.jsx`)

- ✅ Hiển thị cover image ở đầu card
- ✅ Image clickable để vào chi tiết bài viết
- ✅ Kích thước cố định: `h-48 object-cover`
- ✅ Hover effect: opacity transition
- ✅ Error handling: ẩn ảnh nếu load lỗi

#### PostDetail Page (`client/src/pages/PostDetail.jsx`)

- ✅ Hiển thị cover image lớn ở đầu bài viết
- ✅ Kích thước: `h-96` (taller than card)
- ✅ Rounded corners và shadow
- ✅ Error handling: ẩn ảnh nếu load lỗi

## Cách sử dụng

### 1. Tạo blog mới với ảnh bìa:

1. Vào trang "New Post" (http://localhost:5173/editor)
2. Điền Title và Tags
3. **Dán URL ảnh vào field "Cover Image URL"**
   - Gợi ý: Dùng https://unsplash.com/ để lấy ảnh miễn phí
   - Ví dụ: `https://images.unsplash.com/photo-1234567890?w=800&h=400&fit=crop`
4. Viết nội dung Markdown
5. Click "Publish Post"

### 2. Preview ảnh trong Editor:

- Khi nhập URL ảnh, preview sẽ hiển thị ngay bên dưới input
- Nếu URL không hợp lệ, ảnh sẽ không hiển thị

### 3. Xem ảnh bìa:

- **Trang chủ**: Ảnh hiển thị trên mỗi PostCard (cao 192px)
- **Chi tiết bài viết**: Ảnh hiển thị lớn hơn ở đầu trang (cao 384px)

## Nguồn ảnh đề xuất

### Unsplash (Miễn phí, không cần attribution)

- URL format: `https://images.unsplash.com/photo-{id}?w=800&h=400&fit=crop`
- Kích thước đề xuất: `w=800&h=400` (tỷ lệ 2:1)

### Pexels (Miễn phí)

- URL: https://www.pexels.com/

### Pixabay (Miễn phí)

- URL: https://pixabay.com/

## Kỹ thuật Implementation

### Error Handling

Tất cả các nơi hiển thị ảnh đều có error handler:

```jsx
onError={(e) => {
  e.target.style.display = 'none';
}}
```

- Nếu URL không hợp lệ hoặc ảnh không load được → ẩn ảnh, không show broken image icon

### Responsive Design

- Mobile: Ảnh vẫn full width, tự động scale
- Desktop: Ảnh có width cố định theo container

### Performance

- Dùng `object-cover` để crop ảnh theo aspect ratio
- Không resize ảnh ở server (để đơn giản)
- Browser tự cache ảnh từ CDN

## Testing

### ✅ Đã test:

1. Database được reseed với 8 posts có cover images
2. Editor form có input field cho cover image
3. Preview hoạt động trong Editor
4. PostCard hiển thị ảnh trên trang chủ
5. PostDetail hiển thị ảnh lớn

### 🧪 Cần test:

1. Tạo blog mới với cover image
2. Edit blog để thêm/sửa cover image
3. Test với URL không hợp lệ
4. Test với ảnh rất lớn/nhỏ

## Notes

- Field `coverImage` là **optional** (không bắt buộc)
- Nếu không có ảnh, bài viết vẫn hiển thị bình thường (chỉ không có phần ảnh)
- Database đã được reseed nên tất cả posts hiện có đều có ảnh mẫu
- Frontend có live preview để user kiểm tra ảnh trước khi publish

## Troubleshooting

### Ảnh không hiển thị?

- ✅ Kiểm tra URL có đúng format không
- ✅ Thử mở URL trực tiếp trên browser
- ✅ Kiểm tra CORS policy của image host
- ✅ Dùng Unsplash/Pexels để đảm bảo ảnh public

### Ảnh bị lỗi tỷ lệ?

- ✅ Dùng URLs có query params: `?w=800&h=400&fit=crop`
- ✅ `object-cover` trong CSS sẽ tự crop ảnh theo container

---

**Status**: ✅ HOÀN THÀNH - Ready to use!
