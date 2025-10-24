# 📝 PaperPress Server

Backend API cho PaperPress CMS.

## Cài Đặt

```bash
npm install
```

## Cấu Hình

Tạo file `.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/paperpress
JWT_SECRET=devsecret
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Chạy

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Seed Database

```bash
npm run seed
```

### Run Tests

```bash
npm test
```

## API Documentation

Xem [README.md](../README.md) ở root project.

## Design Patterns

### Decorator Pattern - Content Pipeline

`src/services/ContentPipeline/`

### Strategy Pattern - Trending

`src/services/Trending/`
