/**
 * app.js
 * Express application setup
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import appConfig from './config/AppConfig.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import trendingRoutes from './routes/trending.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';

// Middlewares
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: appConfig.corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static hosting for uploaded files
const uploadsDir = path.resolve('uploads');
try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) { /* ignore */ }
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'PaperPress API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/posts', commentsRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/uploads', uploadsRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
