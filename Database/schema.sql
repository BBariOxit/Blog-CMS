-- =====================================================
-- PAPERPRESS CMS - DATABASE SCHEMA (MongoDB)
-- =====================================================
-- Đây là mô tả schema dưới dạng SQL-like
-- Thực tế sử dụng MongoDB (NoSQL)
-- =====================================================

-- =====================================================
-- TABLE: users (Collection)
-- Mô tả: Quản lý người dùng hệ thống
-- =====================================================

CREATE TABLE users (
    _id                 ObjectId        PRIMARY KEY,
    name                VARCHAR(100)    NOT NULL,
    email               VARCHAR(255)    NOT NULL UNIQUE,
    password            VARCHAR(255)    NOT NULL,  -- Bcrypt hashed
    role                ENUM('author', 'editor', 'admin') DEFAULT 'author',
    createdAt           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updatedAt           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =====================================================
-- TABLE: posts (Collection)
-- Mô tả: Quản lý bài viết blog
-- =====================================================

CREATE TABLE posts (
    _id                 ObjectId        PRIMARY KEY,
    title               VARCHAR(255)    NOT NULL,
    slug                VARCHAR(255)    NOT NULL UNIQUE,
    content             TEXT            NOT NULL,        -- Markdown
    contentHtml         TEXT,                           -- Processed HTML
    excerpt             TEXT,                           -- Tóm tắt
    coverImage          VARCHAR(500),                   -- URL ảnh bìa
    tags                JSON,                           -- Array of strings
    author              ObjectId        NOT NULL,       -- Reference to users
    status              ENUM('draft', 'published') DEFAULT 'draft',
    views               INT             DEFAULT 0,
    likes               INT             DEFAULT 0,
    readingTime         INT             DEFAULT 1,      -- Phút
    publishedAt         TIMESTAMP,
    createdAt           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updatedAt           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_author (author),
    INDEX idx_status (status),
    INDEX idx_tags (tags),
    INDEX idx_publishedAt (publishedAt DESC),
    INDEX idx_views (views DESC),
    
    FOREIGN KEY (author) REFERENCES users(_id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: comments (Collection)
-- Mô tả: Quản lý bình luận bài viết
-- =====================================================

CREATE TABLE comments (
    _id                 ObjectId        PRIMARY KEY,
    post                ObjectId        NOT NULL,       -- Reference to posts
    content             TEXT            NOT NULL,
    author              VARCHAR(100)    NOT NULL,       -- Tên (có thể anonymous)
    createdAt           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updatedAt           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_post (post),
    INDEX idx_createdAt (createdAt DESC),
    
    FOREIGN KEY (post) REFERENCES posts(_id) ON DELETE CASCADE
);

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

-- Lấy tất cả bài viết published của 1 tác giả
SELECT * FROM posts 
WHERE author = '<userId>' AND status = 'published'
ORDER BY publishedAt DESC;

-- Lấy top 10 bài viết trending (most views)
SELECT * FROM posts 
WHERE status = 'published'
ORDER BY views DESC 
LIMIT 10;

-- Lấy bài viết theo tag
SELECT * FROM posts 
WHERE status = 'published' AND 'javascript' IN tags
ORDER BY publishedAt DESC;

-- Đếm số bài viết của từng tác giả
SELECT author, COUNT(*) as postCount
FROM posts
WHERE status = 'published'
GROUP BY author;

-- Lấy bài viết kèm thông tin tác giả (JOIN)
SELECT 
    p.*,
    u.name as authorName,
    u.email as authorEmail
FROM posts p
LEFT JOIN users u ON p.author = u._id
WHERE p.status = 'published'
ORDER BY p.publishedAt DESC;

-- Lấy comments của 1 bài viết
SELECT * FROM comments
WHERE post = '<postId>'
ORDER BY createdAt DESC;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Trending algorithms
CREATE INDEX idx_trending_views ON posts(views DESC, publishedAt DESC);
CREATE INDEX idx_trending_engagement ON posts(likes DESC, views DESC);

-- Search
CREATE INDEX idx_search_title ON posts(title);
CREATE INDEX idx_search_content ON posts(content);

-- =====================================================
-- NOTES
-- =====================================================
-- 1. MongoDB sử dụng BSON thay vì JSON
-- 2. ObjectId tự động generate và unique
-- 3. Timestamps tự động quản lý bởi Mongoose
-- 4. Indexes giúp tối ưu query performance
-- =====================================================
