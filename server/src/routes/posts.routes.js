/**
 * posts.routes.js
 * Routes cho posts
 */

import express from 'express';
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  updatePostStatus,
  likePost,
  deletePost,
  getTrending,
} from '../controllers/posts.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);
router.patch('/:id/like', likePost);

// Protected routes - Author+
router.post('/', authenticate, requireRole(['author', 'editor', 'admin']), createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

// Protected routes - Editor/Admin only
router.patch('/:id/status', authenticate, requireRole(['editor', 'admin']), updatePostStatus);

export default router;
