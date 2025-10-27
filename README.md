<div align="center">

# 📝 PaperPress CMS

### Modern Blog Platform with Advanced Design Patterns

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Docs](#-api-reference) • [Demo](#-demo)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Design Patterns](#-design-patterns)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**PaperPress** is a production-ready, full-stack blog CMS built with modern web technologies and enterprise-level design patterns. It demonstrates best practices in software architecture, security, and scalable application development.

### Why PaperPress?

- ✅ **Design Pattern Showcase** - Implements Decorator and Strategy patterns
- ✅ **Production Ready** - Docker support, environment configs, error handling
- ✅ **Secure by Default** - JWT auth, XSS protection, input sanitization
- ✅ **Developer Friendly** - Clean code, comprehensive tests, well-documented
- ✅ **Scalable Architecture** - Modular structure, separation of concerns

---

## 🚀 Key Features

### Core Functionality

- 📝 **Rich Content Editor** - Markdown support with live preview
- 🔐 **Authentication System** - JWT-based auth with role management
- 🖼️ **Media Upload** - Image upload with cover image support
- 💬 **Comment System** - Nested comments and engagement tracking
- 🔥 **Trending Algorithm** - Multiple ranking strategies
- 🏷️ **Tagging System** - Organize content with tags
- 🔍 **Search & Filter** - Full-text search across posts
- 📊 **Analytics** - Views, likes, and engagement metrics

### Technical Highlights

- 🎨 **Decorator Pattern** - Extensible content processing pipeline
- 🎯 **Strategy Pattern** - Pluggable trending algorithms
- 🔄 **RESTful API** - Clean, versioned API design
- 🐳 **Docker Ready** - Containerized deployment
- 🧪 **Tested** - Unit tests for critical components
- 📱 **Responsive UI** - Mobile-first design with Tailwind CSS

---

## 🛠 Tech Stack

### Backend

| Technology    | Purpose             | Version |
| ------------- | ------------------- | ------- |
| Node.js       | Runtime environment | 18+     |
| Express       | Web framework       | 4.18+   |
| MongoDB       | Database            | 7.0+    |
| Mongoose      | ODM                 | 8.0+    |
| JWT           | Authentication      | 9.0+    |
| Bcrypt        | Password hashing    | 2.4+    |
| Marked        | Markdown parser     | 11.1+   |
| Sanitize-HTML | XSS protection      | 2.11+   |
| Highlight.js  | Syntax highlighting | 11.9+   |

### Frontend

| Technology   | Purpose          | Version |
| ------------ | ---------------- | ------- |
| React        | UI library       | 18.2+   |
| Vite         | Build tool       | 5.0+    |
| React Router | Routing          | 6.21+   |
| Axios        | HTTP client      | 1.6+    |
| Tailwind CSS | Styling          | 3.4+    |
| Zustand      | State management | -       |

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Jest** - Testing framework
- **Nodemon** - Development auto-reload

---

## 🏗 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Editor  │  │  Login   │  │  Admin   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth Routes │  │ Post Routes  │  │ Comment Routes│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Content Processing Pipeline              │     │
│  │  BaseProcessor → Markdown → Sanitize → Highlight  │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Trending Ranking System                  │     │
│  │  TrendingContext + Strategy (Views/Velocity/...)   │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   User   │  │   Post   │  │ Comment  │                  │
│  │  Model   │  │  Model   │  │  Model   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                    MongoDB Database                          │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
paperpress/
├── 📂 server/                      # Backend application
│   ├── 📂 src/
│   │   ├── 📂 config/              # Configuration files
│   │   │   ├── AppConfig.js        # Singleton config manager
│   │   │   └── MongoClient.js      # Database connection
│   │   ├── 📂 models/              # Mongoose schemas
│   │   │   ├── User.js             # User model (roles, auth)
│   │   │   ├── Post.js             # Post model (content, metadata)
│   │   │   └── Comment.js          # Comment model (nested)
│   │   ├── 📂 services/            # Business logic
│   │   │   ├── 📂 ContentPipeline/ # 🎨 Decorator Pattern
│   │   │   │   ├── BaseProcessor.js
│   │   │   │   ├── MarkdownDecorator.js
│   │   │   │   ├── SanitizeDecorator.js
│   │   │   │   ├── HighlightDecorator.js
│   │   │   │   └── ReadingTimeDecorator.js
│   │   │   ├── 📂 Trending/       # 🎯 Strategy Pattern
│   │   │   │   ├── TrendingContext.js
│   │   │   │   ├── ByViewsStrategy.js
│   │   │   │   ├── ByVelocityStrategy.js
│   │   │   │   └── ByWeightedEngagementStrategy.js
│   │   │   └── 📂 Recommendations/ # Recommendation engine
│   │   ├── 📂 controllers/         # Request handlers
│   │   ├── 📂 routes/              # API endpoints
│   │   ├── 📂 middlewares/         # Auth, validation, error handling
│   │   ├── 📂 utils/               # Helper functions
│   │   ├── 📂 tests/               # Unit & integration tests
│   │   ├── app.js                  # Express app setup
│   │   ├── server.js               # Entry point
│   │   └── seed.js                 # Database seeder
│   ├── 📂 uploads/                 # User-uploaded files
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── 📂 client/                      # Frontend application
│   ├── 📂 src/
│   │   ├── 📂 pages/               # Route components
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Editor.jsx          # Post editor
│   │   │   ├── PostDetail.jsx      # Single post view
│   │   │   ├── Login.jsx           # Authentication
│   │   │   ├── AdminPosts.jsx      # Admin dashboard
│   │   │   └── MyPosts.jsx         # User posts
│   │   ├── 📂 components/          # Reusable UI components
│   │   │   ├── Header.jsx          # Navigation bar
│   │   │   ├── PostCard.jsx        # Post preview card
│   │   │   ├── PostList.jsx        # Post grid/list
│   │   │   ├── MarkdownPreview.jsx # Markdown renderer
│   │   │   ├── Loading.jsx         # Loading states
│   │   │   └── ErrorBoundary.jsx   # Error handling
│   │   ├── 📂 api/                 # API client
│   │   │   ├── http.js             # Axios instance
│   │   │   ├── auth.js             # Auth endpoints
│   │   │   ├── posts.js            # Post endpoints
│   │   │   └── uploads.js          # Upload endpoints
│   │   ├── 📂 store/               # State management
│   │   │   └── authStore.js        # Auth state (Zustand)
│   │   ├── App.jsx                 # Root component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── docker-compose.yml              # Docker orchestration
├── README.md                       # This file
└── LICENSE                         # MIT License
```

---

## 🎨 Design Patterns

### 1. Decorator Pattern - Content Processing Pipeline

The Decorator pattern allows dynamic composition of content processing behaviors.

#### Architecture

```javascript
┌─────────────────┐
│ BaseProcessor   │ ← Interface
└─────────────────┘
         ▲
         │ implements
         │
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Markdown        │────▶│ Sanitize         │────▶│ Highlight        │
│ Decorator       │     │ Decorator        │     │ Decorator        │
└─────────────────┘     └──────────────────┘     └──────────────────┘
         │                       │                         │
         └───────────────────────┴─────────────────────────┘
                                 │
                         ┌───────▼───────┐
                         │ ReadingTime   │
                         │ Decorator     │
                         └───────────────┘
```

#### Flow Example

````javascript
// Input: Raw Markdown
const input = "# Hello **World**\n```js\nconst x = 1;\n```";

// Pipeline execution
BaseProcessor
  → MarkdownDecorator    // Converts to HTML
  → SanitizeDecorator    // Removes XSS
  → HighlightDecorator   // Adds syntax highlighting
  → ReadingTimeDecorator // Calculates reading time

// Output: Safe, highlighted HTML + metadata
{
  contentHtml: "<h1>Hello <strong>World</strong></h1>...",
  readingTime: 1,
  excerpt: "Hello World..."
}
````

#### Benefits

- ✅ **Open/Closed Principle** - Add new processors without modifying existing code
- ✅ **Single Responsibility** - Each decorator has one job
- ✅ **Flexibility** - Easy to reorder or skip steps
- ✅ **Testability** - Test each decorator in isolation

#### Implementation Files

- `server/src/services/ContentPipeline/BaseProcessor.js`
- `server/src/services/ContentPipeline/MarkdownDecorator.js`
- `server/src/services/ContentPipeline/SanitizeDecorator.js`
- `server/src/services/ContentPipeline/HighlightDecorator.js`
- `server/src/services/ContentPipeline/ReadingTimeDecorator.js`
- `server/src/utils/buildContent.js`

### 2. Strategy Pattern - Trending Algorithm

The Strategy pattern enables runtime selection of ranking algorithms.

#### Architecture

```javascript
┌──────────────────────┐
│ TrendingContext      │
│ - setStrategy()      │
│ - execute()          │
└──────────────────────┘
           │
           ├─────────────┬────────────────┬──────────────────┐
           ▼             ▼                ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐  ┌─────────────┐
│ ByViews      │ │ ByVelocity   │ │ ByWeighted   │  │ Custom...   │
│ Strategy     │ │ Strategy     │ │ Engagement   │  │ Strategy    │
└──────────────┘ └──────────────┘ └──────────────┘  └─────────────┘
```

#### Strategies

| Strategy                 | Algorithm                      | Use Case                  |
| ------------------------ | ------------------------------ | ------------------------- |
| **ByViews**              | `ORDER BY views DESC`          | Simple popularity ranking |
| **ByVelocity**           | `views / age_in_hours`         | Recent viral content      |
| **ByWeightedEngagement** | `views + 5×likes + 3×comments` | Holistic engagement       |

#### Usage Example

```javascript
// Client request
GET /api/trending?mode=velocity&limit=10

// Server execution
const context = new TrendingContext();

switch (mode) {
  case 'views':
    context.setStrategy(new ByViewsStrategy());
    break;
  case 'velocity':
    context.setStrategy(new ByVelocityStrategy());
    break;
  case 'weighted':
    context.setStrategy(new ByWeightedEngagementStrategy());
    break;
}

const trending = await context.execute(limit);
```

#### Benefits

- ✅ **Runtime Flexibility** - Change algorithm without code changes
- ✅ **Maintainability** - Each strategy is independent
- ✅ **Extensibility** - Add new strategies easily
- ✅ **A/B Testing** - Compare different algorithms

#### Implementation Files

- `server/src/services/Trending/TrendingContext.js`
- `server/src/services/Trending/ByViewsStrategy.js`
- `server/src/services/Trending/ByVelocityStrategy.js`
- `server/src/services/Trending/ByWeightedEngagementStrategy.js`
- `server/src/routes/trending.routes.js`

---

## ⚡ Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **MongoDB** >= 7.0 ([Download](https://www.mongodb.com/try/download/community))
- **npm** >= 9.0.0 (comes with Node.js)
- **Docker** (Optional, recommended) ([Download](https://www.docker.com/))

### 🚀 One-Click Setup & Run (Windows)

**The easiest way to run PaperPress CMS!** Just double-click one file:

```bash
# Simply double-click this file, or run in terminal:
run.bat
```

**What it does automatically:**
1. ✅ Checks Node.js installation
2. ✅ Creates environment configuration files (.env)
3. ✅ Installs all dependencies (server + client)
4. ✅ Starts MongoDB with Docker (if available)
5. ✅ Optionally seeds database with sample data
6. ✅ Starts backend server (http://localhost:4000)
7. ✅ Starts frontend client (http://localhost:5173)
8. ✅ Opens application in your browser

**That's it!** Everything is automated in one file. No manual setup needed! 🎉

**To stop all services:**
```bash
stop.bat
```

---

### Installation

#### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/BBariOxit/Blog-CMS.git
cd Blog-CMS

# Start all services
docker-compose up -d

# Seed database
docker-compose exec server npm run seed

# Access application
# Frontend: http://localhost:5173
# Backend:  http://localhost:4000
```

#### Option 2: Local Development

```bash
# 1. Clone repository
git clone https://github.com/BBariOxit/Blog-CMS.git
cd Blog-CMS

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit .env files with your settings

# 4. Start MongoDB
# Windows: Start MongoDB service
# macOS/Linux: mongod

# 5. Seed database (in server directory)
cd server
npm run seed

# 6. Start backend (Terminal 1)
npm run dev

# 7. Start frontend (Terminal 2)
cd client
npm run dev
```

### Default Accounts

After seeding, you can login with:

| Email                | Password   | Role   |
| -------------------- | ---------- | ------ |
| `author@example.com` | `password` | Author |
| `editor@example.com` | `password` | Editor |

---

## ⚙ Configuration

### Environment Variables

#### Server (`server/.env`)

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/paperpress

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_PATH=./uploads
```

#### Client (`client/.env`)

```env
# API Configuration
VITE_API_URL=http://localhost:4000/api

# Optional: Analytics, etc.
# VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Docker Configuration

Edit `docker-compose.yml` for containerized deployment:

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  server:
    build: ./server
    ports:
      - "4000:4000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/paperpress
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  client:
    build: ./client
    ports:
      - "5173:5173"
    depends_on:
      - server

volumes:
  mongo_data:
```

---

## 📡 API Reference

### Authentication

#### Register New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "author"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "author"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Posts

#### Get All Posts

```http
GET /api/posts?page=1&limit=10&status=published&tag=javascript&q=react
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status: `published`, `draft`
- `tag` - Filter by tag
- `q` - Search query (title, excerpt, content)

**Response:**

```json
{
  "posts": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalPosts": 48
}
```

#### Get Single Post

```http
GET /api/posts/:slug
```

Automatically increments view count.

#### Create Post

```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Getting Started with Node.js",
  "content": "# Introduction\n\nNode.js is...",
  "excerpt": "Learn the basics of Node.js",
  "tags": ["nodejs", "javascript", "backend"],
  "coverImage": "https://example.com/image.jpg",
  "status": "draft"
}
```

#### Update Post

```http
PUT /api/posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "# Updated content..."
}
```

#### Publish/Unpublish Post

```http
PATCH /api/posts/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "published"
}
```

Requires `editor` role.

#### Like Post

```http
PATCH /api/posts/:id/like
```

#### Delete Post

```http
DELETE /api/posts/:id
Authorization: Bearer {token}
```

### Trending

#### Get Trending Posts

```http
GET /api/trending?mode=velocity&limit=10
```

**Query Parameters:**

- `mode` - Strategy: `views`, `velocity`, `weighted` (default: `weighted`)
- `limit` - Number of posts (default: 10, max: 50)

### Comments

#### Get Comments for Post

```http
GET /api/posts/:postId/comments
```

#### Create Comment

```http
POST /api/posts/:postId/comments
Content-Type: application/json

{
  "content": "Great article!",
  "author": "Anonymous"
}
```

### Uploads

#### Upload Image

```http
POST /api/uploads/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "image": <file>
}
```

**Response:**

```json
{
  "url": "http://localhost:4000/uploads/images/1234567890-image.jpg"
}
```

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd server
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Test Structure

```
server/src/tests/
├── pipeline.test.js      # Content processing tests
├── trending.test.js      # Trending algorithm tests
└── ...
```

### Example Test Output

```
PASS  src/tests/pipeline.test.js
  Content Processing Pipeline
    ✓ should convert markdown to HTML (15ms)
    ✓ should sanitize XSS attacks (8ms)
    ✓ should highlight code blocks (12ms)
    ✓ should calculate reading time (5ms)

PASS  src/tests/trending.test.js
  Trending Strategies
    ✓ ByViewsStrategy should sort by views (10ms)
    ✓ ByVelocityStrategy should favor recent posts (9ms)
    ✓ ByWeightedEngagement should use composite score (11ms)

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Time:        2.456s
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` in environment
- [ ] Configure CORS for production domain
- [ ] Set up MongoDB replica set
- [ ] Enable MongoDB authentication
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL/TLS certificates
- [ ] Configure CDN for static assets
- [ ] Set up logging and monitoring
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

### Deploy with Docker

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose logs -f
```

### Deploy to Cloud

#### Heroku

```bash
# Login
heroku login

# Create app
heroku create paperpress-api

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

#### AWS / DigitalOcean / Azure

Refer to platform-specific documentation for Node.js deployment.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Use ES6+ syntax
- Follow Airbnb JavaScript Style Guide
- Add JSDoc comments for functions
- Write tests for new features
- Keep functions small and focused

### Commit Messages

Follow conventional commits:

```
feat: add user profile page
fix: resolve authentication bug
docs: update API documentation
test: add tests for trending service
refactor: improve content pipeline
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 PaperPress Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- **Design Patterns** - Gang of Four
- **Markdown Processing** - [marked.js](https://marked.js.org/)
- **Syntax Highlighting** - [highlight.js](https://highlightjs.org/)
- **UI Framework** - [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Support

- 📧 Email: support@paperpress.dev
- 💬 Discord: [Join our community](https://discord.gg/paperpress)
- 🐛 Issues: [GitHub Issues](https://github.com/BBariOxit/Blog-CMS/issues)
- 📖 Docs: [Documentation](https://docs.paperpress.dev)

---

## 🗺 Roadmap

- [ ] **v1.1** - Real-time collaboration
- [ ] **v1.2** - GraphQL API
- [ ] **v1.3** - Multi-language support
- [ ] **v1.4** - Advanced analytics dashboard
- [ ] **v2.0** - Microservices architecture

---

<div align="center">

### ⭐ Star us on GitHub — it motivates us a lot!

Made with ❤️ by the PaperPress Team

[Website](https://paperpress.dev) • [Documentation](https://docs.paperpress.dev) • [Blog](https://blog.paperpress.dev)

</div>
