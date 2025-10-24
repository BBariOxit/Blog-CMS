/**
 * auth.routes.js
 * Routes cho authentication
 */

import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
