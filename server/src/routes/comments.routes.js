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
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', createComment);

// Protected routes - Editor/Admin only
router.patch('/comments/:id/approve', authenticate, requireRole(['editor', 'admin']), approveComment);

export default router;
