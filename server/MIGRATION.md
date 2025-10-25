# Database Migration Scripts

## 📝 Available Scripts

### 1. Seed Database

Populate database with sample blog posts, users, and comments.

```bash
npm run seed
# or
node src/seed.js
```

**Features:**

- Creates 2 users (author & editor)
- Creates 12 blog posts with:
  - Beautiful tech cover images from Unsplash
  - Auto-generated excerpts
  - Realistic stats (views, likes, comments)
  - Proper tags
- Creates random comments

**Test Accounts:**

- Author: `author@example.com` / `password`
- Editor: `editor@example.com` / `password`

---

### 2. Migrate Excerpts

Add auto-generated excerpts to existing posts.

```bash
node src/utils/migrateExcerpts.js
```

**What it does:**

- Finds posts without excerpts
- Generates clean text excerpts from markdown
- Updates database safely

---

### 3. Update Cover Images

Add beautiful tech images to posts without cover images.

```bash
node src/utils/updateCoverImages.js
```

**What it does:**

- Finds posts without cover images
- Assigns high-quality tech images from Unsplash
- Updates database

---

## 🚀 Quick Start

For a fresh database with everything:

```bash
# 1. Drop existing data and seed fresh
npm run seed

# 2. Start the server
npm start
```

For updating existing database:

```bash
# Add excerpts to old posts
node src/utils/migrateExcerpts.js

# Add cover images to posts
node src/utils/updateCoverImages.js
```

---

## 🎨 Cover Image Sources

All images are from [Unsplash](https://unsplash.com) with proper licensing:

- React/JavaScript code screenshots
- Modern tech workspaces
- Programming environments
- Developer tools
- Code editors

Images are optimized:

- Width: 1200px
- Height: 600px
- Quality: 80%
- Format: Auto (WebP when supported)

---

## 🔒 Safety Notes

All migration scripts:

- ✅ Connect/disconnect safely
- ✅ Handle errors gracefully
- ✅ Don't modify existing data unnecessarily
- ✅ Provide detailed console output
- ✅ Exit cleanly after completion

**Always backup your database before running migrations in production!**
