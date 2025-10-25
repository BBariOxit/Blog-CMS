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
    title: 'Getting Started with React 18',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Getting Started with React 18

React 18 brings exciting new features like **concurrent rendering** and **automatic batching**.

## Installation

\`\`\`bash
npm install react@18 react-dom@18
\`\`\`

## Key Features

1. Automatic Batching
2. Transitions
3. Suspense improvements

\`\`\`javascript
import { useState, useTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => {
      startTransition(() => {
        setCount(c => c + 1);
      });
    }}>
      Count: {count}
    </button>
  );
}
\`\`\`

Happy coding! 🚀`,
    tags: ['react', 'javascript', 'frontend'],
    views: 156,
    likes: 23,
    commentsCount: 5,
  },
  {
    title: 'MongoDB Design Patterns',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# MongoDB Design Patterns

Explore essential **design patterns** for MongoDB applications.

## Schema Design

\`\`\`javascript
// User schema with embedded address
const userSchema = {
  name: String,
  email: String,
  address: {
    street: String,
    city: String,
    country: String
  }
};
\`\`\`

## Indexing Strategy

Create indexes for frequently queried fields:

\`\`\`javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.posts.createIndex({ createdAt: -1 });
\`\`\`

Performance is key! ⚡`,
    tags: ['mongodb', 'database', 'backend'],
    views: 89,
    likes: 12,
    commentsCount: 3,
  },
  {
    title: 'Node.js Best Practices 2024',
    coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Node.js Best Practices 2024

Modern Node.js development requires following **best practices** for maintainable code.

## Error Handling

\`\`\`javascript
// Use async/await with try-catch
async function fetchData() {
  try {
    const data = await api.get('/data');
    return data;
  } catch (error) {
    logger.error('Failed to fetch:', error);
    throw error;
  }
}
\`\`\`

## Environment Variables

Never hardcode secrets! Use \`.env\`:

\`\`\`bash
PORT=3000
DATABASE_URL=mongodb://localhost/mydb
JWT_SECRET=supersecret
\`\`\`

Stay secure! 🔒`,
    tags: ['nodejs', 'javascript', 'backend'],
    views: 234,
    likes: 45,
    commentsCount: 8,
  },
  {
    title: 'Understanding Decorator Pattern',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Understanding Decorator Pattern

The **Decorator Pattern** allows you to add new functionality to objects dynamically.

## Real-World Example

\`\`\`javascript
class Coffee {
  cost() { return 5; }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() {
    return this.coffee.cost() + 2;
  }
}

const myCoffee = new MilkDecorator(new Coffee());
console.log(myCoffee.cost()); // 7
\`\`\`

Flexible and powerful! 💪`,
    tags: ['design-patterns', 'javascript', 'architecture'],
    views: 67,
    likes: 15,
    commentsCount: 2,
  },
  {
    title: 'Strategy Pattern in Action',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Strategy Pattern in Action

The **Strategy Pattern** defines a family of algorithms and makes them interchangeable.

## Payment Example

\`\`\`javascript
class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  pay(amount) {
    return this.strategy.pay(amount);
  }
}

class CreditCardStrategy {
  pay(amount) {
    return \`Paid $\${amount} with credit card\`;
  }
}

class PayPalStrategy {
  pay(amount) {
    return \`Paid $\${amount} with PayPal\`;
  }
}

const payment = new PaymentContext(new CreditCardStrategy());
payment.pay(100);
\`\`\`

Clean and maintainable! ✨`,
    tags: ['design-patterns', 'javascript', 'architecture'],
    views: 92,
    likes: 18,
    commentsCount: 4,
  },
  {
    title: 'Express.js Middleware Deep Dive',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Express.js Middleware Deep Dive

Understanding **middleware** is crucial for Express.js mastery.

## Custom Middleware

\`\`\`javascript
const logger = (req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
};

app.use(logger);
\`\`\`

## Error Handling Middleware

\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
\`\`\`

Power up your Express apps! 🔥`,
    tags: ['expressjs', 'nodejs', 'backend'],
    views: 178,
    likes: 31,
    commentsCount: 6,
  },
  {
    title: 'CSS Grid vs Flexbox',
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# CSS Grid vs Flexbox

Choose the right tool for your **layout needs**.

## When to use Grid

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## When to use Flexbox

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

Master both! 🎨`,
    tags: ['css', 'frontend', 'web-design'],
    views: 145,
    likes: 27,
    commentsCount: 7,
  },
  {
    title: 'Async/Await Best Practices',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Async/Await Best Practices

Write **clean asynchronous code** with these tips.

## Parallel Execution

\`\`\`javascript
// Good: Parallel
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);

// Bad: Sequential
const users = await fetchUsers();
const posts = await fetchPosts();
\`\`\`

## Error Handling

\`\`\`javascript
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Error:', error);
  return null;
}
\`\`\`

Async made easy! ⚡`,
    tags: ['javascript', 'async', 'programming'],
    views: 201,
    likes: 38,
    commentsCount: 9,
  },
  {
    title: 'TypeScript for Beginners',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# TypeScript for Beginners

Learn **TypeScript** to write safer, more maintainable code.

## Basic Types

\`\`\`typescript
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};
\`\`\`

Type safety rocks! 🎯`,
    tags: ['typescript', 'javascript', 'programming'],
    views: 312,
    likes: 67,
    commentsCount: 12,
  },
  {
    title: 'Docker Containers 101',
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Docker Containers 101

Get started with **Docker** and containerize your applications.

## Dockerfile Example

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Docker Compose

\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: mongo:latest
    ports:
      - "27017:27017"
\`\`\`

Containerize everything! 🐳`,
    tags: ['docker', 'devops', 'containers'],
    views: 187,
    likes: 42,
    commentsCount: 10,
  },
  {
    title: 'REST API Design Principles',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# REST API Design Principles

Build **clean and intuitive** REST APIs.

## HTTP Methods

- GET: Retrieve resources
- POST: Create new resources
- PUT: Update resources
- DELETE: Remove resources

\`\`\`javascript
// Good API design
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
\`\`\`

## Response Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

Design matters! 🏗️`,
    tags: ['api', 'rest', 'backend'],
    views: 265,
    likes: 54,
    commentsCount: 15,
  },
  {
    title: 'Git Workflow Best Practices',
    coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=600&fit=crop&q=80',
    contentMarkdown: `# Git Workflow Best Practices

Master **Git** for better collaboration.

## Branching Strategy

\`\`\`bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature
\`\`\`

## Commit Messages

\`\`\`
feat: add user authentication
fix: resolve login bug
docs: update README
refactor: clean up code
\`\`\`

Good commits = good history! 📚`,
    tags: ['git', 'version-control', 'devops'],
    views: 198,
    likes: 36,
    commentsCount: 8,
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
    let author = await User.findOne({ email: 'author@example.com' });
    if (!author) {
      author = await User.create({
        email: 'author@example.com',
        passwordHash: authorPassword,
        displayName: 'John Author',
        role: 'author',
        bio: 'Passionate writer and tech enthusiast. Love sharing knowledge about web development.',
        isActive: true,
        lastLogin: new Date(),
      });
    }

    let editor = await User.findOne({ email: 'editor@example.com' });
    if (!editor) {
      editor = await User.create({
        email: 'editor@example.com',
        passwordHash: editorPassword,
        displayName: 'Jane Editor',
        role: 'editor',
        bio: 'Professional editor with 5+ years of experience in technical writing and content management.',
        isActive: true,
        lastLogin: new Date(),
      });
    }

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
      const slug = slugify(samplePost.title);
      const post = await Post.findOneAndUpdate(
        { slug },
        {
          $set: {
            title: samplePost.title,
            slug,
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
      const commentAuthors = ['Alice', 'Bob', 'Charlie', 'David', 'Emma'];
      const commentTexts = [
        'Great article! Very helpful.',
        'Thanks for sharing this.',
        'Excellent explanation!',
        'This helped me a lot.',
        'Keep up the good work!',
        'Very informative post.',
        'Love the examples.',
        'Clear and concise.',
        'Looking forward to more content.',
        'Bookmarked for later!',
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
    console.log('🔑 Test Accounts:');
    console.log('   Author: author@example.com / password');
    console.log('   Editor: editor@example.com / password');
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
