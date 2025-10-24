/**
 * trending.routes.js
 * Routes cho trending posts (Strategy Pattern)
 */

import express from 'express';
import { getTrending } from '../controllers/posts.controller.js';

const router = express.Router();

// GET /api/trending?mode=views|velocity|weighted
router.get('/', getTrending);

export default router;
