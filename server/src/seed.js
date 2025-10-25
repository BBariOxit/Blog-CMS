/**
 * seed.js
 * Seed dữ liệu mẫu cho development
 */

import mongoClient from './config/MongoClient.js';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import { processPostContent, generateExcerpt } from './utils/buildContent.js';
import { slugify } from './utils/slugify.js';

// Seeding behavior flags
// By default, we PRESERVE existing data and upsert demo content.
// Set SEED_RESET=true to drop collections before seeding.
const SEED_RESET = (process.env.SEED_RESET || 'false').toLowerCase() === 'true';

// Optional: allow adding a custom user via env without wiping data
const EXTRA_USER_EMAIL = process.env.SEED_USER_EMAIL || '';
const EXTRA_USER_PASSWORD = process.env.SEED_USER_PASSWORD || 'password';
const EXTRA_USER_DISPLAY = process.env.SEED_USER_NAME || '';

const samplePosts = [
  {
    slug: 'getting-started-with-react-18',
    title: 'Bắt đầu với React 18',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Bắt đầu với React 18

![React 18](https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1600&h=900&fit=crop&q=80)

React 18 tập trung vào trải nghiệm người dùng mượt mà hơn nhờ hai trụ cột: **Concurrent Rendering** và **Automatic Batching**. Bài viết này hướng dẫn bạn khởi động nhanh, hiểu đúng thời điểm áp dụng, kèm ví dụ thực tế và checklist triển khai.

## Cài đặt nhanh

\`\`\`bash
npm install react@18 react-dom@18
\`\`\`

## Những điểm nổi bật

- Automatic Batching: gom nhiều state updates trong cùng một tick → ít re-render hơn.
- Transitions: tách cập nhật ưu tiên thấp (ví dụ: lọc danh sách lớn) khỏi tương tác quan trọng.
- Suspense cải tiến: sẵn sàng cho data fetching hiện đại.

## useTransition trong thực tế

\`\`\`javascript
import { useState, useTransition } from 'react';

export default function FilterList({ items }) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(items);

  function onChange(e) {
    const value = e.target.value;
    setQuery(value); // cập nhật tức thì cho input
    startTransition(() => {
      const v = value.toLowerCase();
      setFiltered(items.filter(x => x.toLowerCase().includes(v)));
    });
  }

  return (
    <div>
      <input placeholder="Tìm kiếm…" value={query} onChange={onChange} />
      {isPending && <p>Đang lọc dữ liệu…</p>}
      <ul>{filtered.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  );
}
\`\`\`

## Checklist triển khai

1. Giữ các cập nhật UI tức thì tách biệt khỏi tính toán nặng bằng transition.
2. Dùng Suspense cho vùng content có thể tải chậm thay vì block toàn trang.
3. Theo dõi performance bằng React Profiler, tối ưu các components hay re-render.

> Mẹo: Tránh dùng transition cho các cập nhật bắt buộc đúng ngay lập tức như nhập form quan trọng hoặc xác thực.`,
    tags: ['react', 'javascript', 'frontend'],
    views: 156,
    likes: 23,
    commentsCount: 5,
  },
  {
    slug: 'mongodb-design-patterns',
    title: 'Các mẫu thiết kế MongoDB trong dự án thực tế',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Các mẫu thiết kế MongoDB

![MongoDB](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600&h=900&fit=crop&q=80)

Lựa chọn giữa **Embed** (lồng tài liệu) và **Reference** (tham chiếu) ảnh hưởng lớn đến hiệu năng truy vấn, độ phức tạp cập nhật và khả năng mở rộng.

## Embed vs Reference

\`\`\`javascript
// Embed: phù hợp dữ liệu nhỏ, thường đọc kèm
const order = {
  userId: ObjectId('...'),
  items: [
    { productId: 'p1', qty: 2, price: 120000 },
    { productId: 'p2', qty: 1, price: 450000 },
  ],
};

// Reference: khi dữ liệu lớn hoặc dùng lại ở nhiều nơi
const post = { title: '...', author: ObjectId('userId') };
\`\`\`

## Chỉ mục (Index) cần có

\`\`\`javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.posts.createIndex({ publishedAt: -1 });
db.posts.createIndex({ tags: 1 });
\`\`\`

## Chiến lược nâng cấp schema

- Thêm field mới dưới dạng optional để tránh downtime.
- Ghi migration nhỏ, idempotent; chạy theo batch.
- Dùng TTL hoặc cờ trạng thái để dọn dữ liệu tạm.

> Lời khuyên: Luôn đo bằng ` + "`explain()`" + ` và profiler, không dựa trên cảm nhận.`,
    tags: ['mongodb', 'database', 'backend'],
    views: 89,
    likes: 12,
    commentsCount: 3,
  },
  {
    slug: 'nodejs-best-practices-2025',
    title: 'Thực hành tốt Node.js 2025',
    coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Node.js 2025

![Node.js](https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1600&h=900&fit=crop&q=80)

Mục tiêu chính là **ổn định**, **quan sát được** và **dễ bảo trì**.

## Xử lý lỗi chuẩn hoá

\`\`\`javascript
async function fetchData(api) {
  try {
    const data = await api.get('/data');
    return data;
  } catch (err) {
    logger.error('Fetch thất bại', { err, endpoint: '/data' });
    throw err; // ném lại cho tầng trên quyết định
  }
}
\`\`\`

## Cấu hình qua biến môi trường

\`\`\`bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/paperpress
JWT_SECRET=thay_doi_ngu_mat
\`\`\`

## Log có ngữ cảnh

Dùng Pino/Winston với requestId để truy vết end-to-end. Gộp log theo JSON để dễ phân tích.

## Checklist

- Bật strict mode cho mongoose schema.
- Timeout/Retry khi gọi dịch vụ bên ngoài.
- Đóng tài nguyên đúng cách khi tắt tiến trình.`,
    tags: ['nodejs', 'javascript', 'backend'],
    views: 234,
    likes: 45,
    commentsCount: 8,
  },
  {
    slug: 'understanding-decorator-pattern',
    title: 'Hiểu đúng Decorator Pattern qua ví dụ thực tế',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Decorator Pattern

Decorator cho phép **mở rộng hành vi** của đối tượng bằng cách bọc (wrap) nó trong các lớp bổ sung, không cần sửa lớp gốc.

## Ví dụ đơn giản

\`\`\`javascript
class Coffee { cost() { return 20000; } }

class MilkDecorator {
  constructor(coffee) { this.coffee = coffee; }
  cost() { return this.coffee.cost() + 5000; }
}

console.log(new MilkDecorator(new Coffee()).cost()); // 25000
\`\`\`

## Ứng dụng trong hệ thống

Trong PaperPress, nội dung markdown đi qua chuỗi decorators: sanitize → highlight → readingTime. Mỗi decorator đảm nhiệm một bước độc lập, giúp pipeline linh hoạt và dễ mở rộng.`,
    tags: ['design-patterns', 'javascript', 'architecture'],
    views: 67,
    likes: 15,
    commentsCount: 2,
  },
  {
    slug: 'strategy-pattern-in-action',
    title: 'Strategy Pattern áp dụng cho tính năng Trending',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Strategy Pattern cho Trending

![Trending](https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=900&fit=crop&q=80)

Tách thuật toán xếp hạng thành nhiều chiến lược: theo lượt xem, theo vận tốc, hoặc theo điểm tổng hợp.

\`\`\`javascript
class ByViews { rank(ps) { return [...ps].sort((a,b)=>b.views-a.views); } }
class ByVelocity { rank(ps) { const now=Date.now(); return [...ps].sort((a,b)=> (b.views/((now-b.publishedAt)/36e5)) - (a.views/((now-a.publishedAt)/36e5))); } }

class Context { constructor(strategy){ this.strategy=strategy; } getTrending(p){ return this.strategy.rank(p).slice(0,10); } }
\`\`\`

Ưu điểm: tách biệt thuật toán, mở rộng dễ, test đơn giản.`,
    tags: ['design-patterns', 'javascript', 'architecture'],
    views: 92,
    likes: 18,
    commentsCount: 4,
  },
  {
    slug: 'expressjs-middleware-deep-dive',
    title: 'Đào sâu Middleware trong Express.js',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Middleware Express

Middleware là hàm \`(req, res, next)\`. Hãy tách rõ giữa middleware chức năng (log, auth) và middleware xử lý lỗi.

\`\`\`javascript
const logger = (req, _res, next) => { console.log(req.method, req.url); next(); };
app.use(logger);

// Error handler (4 tham số)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Error' });
});
\`\`\`

> Thứ tự đăng ký quan trọng: logger → auth → routes → error handler.`,
    tags: ['expressjs', 'nodejs', 'backend'],
    views: 178,
    likes: 31,
    commentsCount: 6,
  },
  {
    slug: 'css-grid-vs-flexbox',
    title: 'CSS Grid vs Flexbox: Dùng khi nào?',
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Grid vs Flexbox

![Layout](https://images.unsplash.com/photo-1526925539332-aa3b66e35444?w=1600&h=900&fit=crop&q=80)

Grid phù hợp bố cục 2 chiều; Flexbox tối ưu cho trục đơn.

## Khi dùng Grid

\`\`\`css
.container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
\`\`\`

## Khi dùng Flexbox

\`\`\`css
.navbar { display: flex; justify-content: space-between; align-items: center; }
\`\`\`

Thực tế thường kết hợp cả hai cho layout phức tạp.`,
    tags: ['css', 'frontend', 'web-design'],
    views: 145,
    likes: 27,
    commentsCount: 7,
  },
  {
    slug: 'asyncawait-best-practices',
    title: 'Async/Await: các thực hành nên áp dụng',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Async/Await

Chạy song song khi có thể, luôn có timeout/bắt lỗi và hỗ trợ huỷ (abort) khi cần.

## Chạy song song

\`\`\`javascript
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);
\`\`\`

## Bắt lỗi và timeout

\`\`\`javascript
async function withTimeout(promise, ms = 8000) {
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), ms));
  return Promise.race([promise, timeout]);
}
\`\`\`

## Huỷ yêu cầu (AbortController)

\`\`\`javascript
const ac = new AbortController();
setTimeout(() => ac.abort(), 3000);
await fetch('/api', { signal: ac.signal });
\`\`\``,
    tags: ['javascript', 'async', 'programming'],
    views: 201,
    likes: 38,
    commentsCount: 9,
  },
  {
    slug: 'typescript-for-beginners',
    title: 'TypeScript cho người mới bắt đầu',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# TypeScript cơ bản

![TypeScript](https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1600&h=900&fit=crop&q=80)

TypeScript mang tới hệ thống kiểu tĩnh giúp giảm lỗi runtime và tăng tự tin khi refactor.

## Kiểu cơ bản và Interface

\`\`\`ts
interface User { id: number; name: string; email: string; }
const u: User = { id: 1, name: 'Minh', email: 'minh@example.com' };
\`\`\`

## Generics

\`\`\`ts
function wrap<T>(value: T) { return { value }; }
const x = wrap<number>(42);
\`\`\`

> Lời khuyên: Bật ` + "`strict: true`" + ` trong tsconfig để tận dụng hết sức mạnh TS.`,
    tags: ['typescript', 'javascript', 'programming'],
    views: 312,
    likes: 67,
    commentsCount: 12,
  },
  {
    slug: 'docker-containers-101',
    title: 'Docker cơ bản dành cho lập trình viên',
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Docker cơ bản

Đóng gói ứng dụng để môi trường dev/prod đồng nhất.`,
    tags: ['docker', 'devops', 'containers'],
    views: 187,
    likes: 42,
    commentsCount: 10,
  },
  {
    slug: 'rest-api-design-principles',
    title: 'Nguyên tắc thiết kế REST API',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# REST API Principles

Định tuyến rõ ràng, mã phản hồi nhất quán và có tài liệu.`,
    tags: ['api', 'rest', 'backend'],
    views: 265,
    likes: 54,
    commentsCount: 15,
  },
  {
    slug: 'git-workflow-best-practices',
    title: 'Quy trình làm việc với Git hiệu quả',
    coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Git workflow hiệu quả

Nhánh tính năng, pull request rõ ràng, commit có quy ước.`,
    tags: ['git', 'version-control', 'devops'],
    views: 198,
    likes: 36,
    commentsCount: 8,
  },
  {
    slug: 'nextjs-15-ssr-optimizations',
    title: 'Next.js 15: tối ưu SSR và streaming',
    coverImage: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Next.js 15

Tối ưu SSR với streaming và React Server Components ổn định hơn.`,
    tags: ['nextjs', 'react', 'ssr'],
    views: 173,
    likes: 29,
    commentsCount: 6,
  },
  {
    slug: 'seo-cho-spa',
    title: 'SEO cho SPA: kỹ thuật và công cụ cần biết',
    coverImage: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# SEO cho SPA

Kết hợp SSR, sitemap và Open Graph để cải thiện hiển thị.`,
    tags: ['seo', 'frontend', 'spa'],
    views: 121,
    likes: 22,
    commentsCount: 4,
  },
  {
    slug: 'winston-logging-thuc-tien',
    title: 'Thiết kế hệ thống logging với Winston',
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Logging với Winston

Chuẩn hoá cấu trúc log và thêm requestId để truy vết.`,
    tags: ['nodejs', 'logging', 'winston'],
    views: 98,
    likes: 19,
    commentsCount: 3,
  },
  {
    slug: 'bao-mat-jwt-thuc-hanh',
    title: 'Bảo mật JWT: refresh token, rotate và blacklist',
    coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981d?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Bảo mật JWT

Áp dụng refresh token rotation và blacklist để giảm rủi ro.`,
    tags: ['security', 'jwt', 'auth'],
    views: 207,
    likes: 41,
    commentsCount: 11,
  },
  {
    slug: 'tailwind-templates-nhanh',
    title: 'Tailwind CSS: dựng giao diện nhanh trong 30 phút',
    coverImage: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Tailwind nhanh gọn

Tận dụng utility classes để dựng UI nhanh và đồng nhất.`,
    tags: ['tailwind', 'css', 'frontend'],
    views: 142,
    likes: 24,
    commentsCount: 5,
  },
  {
    slug: 'postgres-vs-mongodb-2025',
    title: 'Postgres vs MongoDB 2025: chọn gì cho dự án mới?',
    coverImage: 'https://images.unsplash.com/photo-1534759846116-57968a6a2b57?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Postgres vs MongoDB

Chọn theo bài toán: quan hệ mạnh vs linh hoạt schema.`,
    tags: ['database', 'postgres', 'mongodb'],
    views: 189,
    likes: 33,
    commentsCount: 7,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting seed process...\n');

    // Connect to MongoDB
    await mongoClient.connect();

    if (SEED_RESET) {
      // Clear existing data (DANGEROUS)
      console.log('🗑️  Clearing existing data (SEED_RESET=true)...');
      await User.deleteMany({});
      await Post.deleteMany({});
      await Comment.deleteMany({});
    } else {
      console.log('🔒 Preserving existing data (default). Upserting demo content...');
    }

    // Create users
    console.log('👤 Creating users...');
  const authorPassword = await User.hashPassword('password');
  const editorPassword = await User.hashPassword('password');

    // Upsert demo users instead of blindly creating
    // Upsert + always refresh displayName/bio for demo accounts
    let author = await User.findOneAndUpdate(
      { email: 'author@example.com' },
      {
        $set: {
          email: 'author@example.com',
          passwordHash: authorPassword,
          displayName: 'Nguyễn An',
          role: 'author',
          bio: 'Tác giả đam mê công nghệ, thích chia sẻ kiến thức về phát triển web và sản phẩm.',
          isActive: true,
          lastLogin: new Date(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    let editor = await User.findOneAndUpdate(
      { email: 'editor@example.com' },
      {
        $set: {
          email: 'editor@example.com',
          passwordHash: editorPassword,
          displayName: 'Trần Bình',
          role: 'editor',
          bio: 'Biên tập viên với 5+ năm kinh nghiệm, yêu thích nội dung kỹ thuật rõ ràng và dễ hiểu.',
          isActive: true,
          lastLogin: new Date(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Optionally add one extra custom user (e.g., your personal email) if provided
    if (EXTRA_USER_EMAIL && EXTRA_USER_DISPLAY) {
      const exists = await User.findOne({ email: EXTRA_USER_EMAIL.toLowerCase() });
      if (!exists) {
        const pwd = await User.hashPassword(EXTRA_USER_PASSWORD);
        await User.create({
          email: EXTRA_USER_EMAIL.toLowerCase(),
          passwordHash: pwd,
          displayName: EXTRA_USER_DISPLAY,
          role: 'author',
          isActive: true,
          lastLogin: new Date(),
        });
        console.log(`👤 Added extra user: ${EXTRA_USER_EMAIL}`);
      } else {
        console.log(`👤 Extra user already exists: ${EXTRA_USER_EMAIL}`);
      }
    }

    console.log(`✅ Created users: ${author.email}, ${editor.email}\n`);

    // Create posts
    console.log('📝 Creating posts...');
    const createdPosts = [];

    for (let i = 0; i < samplePosts.length; i++) {
      const samplePost = samplePosts[i];
      
      // Process content through Decorator pipeline
      const processed = await processPostContent({
        contentMarkdown: samplePost.contentMarkdown,
      });

      const publishedDate = new Date();
      publishedDate.setHours(publishedDate.getHours() - (i * 5)); // Stagger publish times

      // Generate excerpt from markdown
      const excerpt = generateExcerpt(samplePost.contentMarkdown, 200);

      // Upsert post by slug to avoid duplicates and preserve custom data
      const desiredSlug = samplePost.slug ? samplePost.slug : slugify(samplePost.title);
      const post = await Post.findOneAndUpdate(
        { slug: desiredSlug },
        {
          $set: {
            title: samplePost.title,
            slug: desiredSlug,
            author: i % 2 === 0 ? author._id : editor._id,
            contentMarkdown: samplePost.contentMarkdown,
            contentHTML: processed.contentHTML,
            readingTime: processed.readingTime,
            excerpt,
            coverImage: samplePost.coverImage,
            tags: samplePost.tags,
            status: i < 9 ? 'published' : 'draft',
            views: samplePost.views,
            likes: samplePost.likes,
            // commentsCount left as-is when preserving unless reset
            ...(SEED_RESET ? { commentsCount: 0 } : {}),
            publishedAt: i < 9 ? publishedDate : null,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      createdPosts.push(post);
      console.log(`  ✓ "${post.title}" (${post.status})`);
    }

    console.log(`✅ Created ${createdPosts.length} posts\n`);

    // Create comments only on reset to avoid duplicating
    let totalComments = 0;
    if (SEED_RESET) {
      console.log('💬 Creating comments...');
      const commentAuthors = ['Lan', 'Minh', 'Tú', 'Hà', 'Phúc', 'Thảo', 'Hưng'];
      const commentTexts = [
        'Bài viết rất hay và dễ hiểu.',
        'Cảm ơn bạn đã chia sẻ.',
        'Giải thích cực kỳ rõ ràng!',
        'Mình đã áp dụng thành công theo hướng dẫn.',
        'Tiếp tục phát huy nhé!',
        'Nội dung hữu ích cho người mới.',
        'Rất thích các ví dụ minh hoạ.',
        'Ngắn gọn, súc tích.',
        'Mong chờ thêm nhiều bài viết tương tự.',
        'Đã lưu lại để đọc sau!',
      ];

      for (const post of createdPosts) {
        if (post.status === 'published') {
          const numComments = Math.floor(Math.random() * 3) + 1; // 1-3 comments

          for (let i = 0; i < numComments; i++) {
            await Comment.create({
              post: post._id,
              authorName: commentAuthors[Math.floor(Math.random() * commentAuthors.length)],
              content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
              isApproved: true,
            });
            totalComments++;
          }

          // Update commentsCount
          post.commentsCount = numComments;
          await post.save();
        }
      }
      console.log(`✅ Created ${totalComments} comments\n`);
    } else {
      console.log('💬 Skipping demo comments (preserve mode)\n');
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('✨ Seed completed successfully!\n');
    console.log('📋 Summary:');
  console.log(`   Users: at least 2 (preserved + demo upserts)`);
    console.log(`   Posts: ${createdPosts.length} (${createdPosts.filter(p => p.status === 'published').length} published)`);
    console.log(`   Comments: ${totalComments}\n`);
  console.log('🔑 Tài khoản demo:');
  console.log('   Tác giả: author@example.com / password');
  console.log('   Biên tập: editor@example.com / password');
    console.log('═══════════════════════════════════════════════════\n');

    await mongoClient.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    await mongoClient.disconnect();
    process.exit(1);
  }
}

seed();
