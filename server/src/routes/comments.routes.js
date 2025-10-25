/**
 * comments.routes.js
 * Routes cho comments
 */

import express from 'express';
import {
  getComments,
  createComment,
  approveComment,
} from '../controllers/comments.controller.js';
import { authenticate, requireRole, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (with optional auth for comments)
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', optionalAuth, createComment);

// Protected routes - Editor/Admin only
router.patch('/comments/:id/approve', authenticate, requireRole(['editor', 'admin']), approveComment);

export default router;
