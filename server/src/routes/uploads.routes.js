/**
 * uploads.routes.js
 * Routes for handling media uploads (images)
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Ensure directory exists
const IMAGES_DIR = path.resolve('uploads/images');
try { fs.mkdirSync(IMAGES_DIR, { recursive: true }); } catch (e) {/* ignore */}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_').slice(0, 60);
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${safeBase || 'image'}-${unique}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

/**
 * POST /api/uploads/images
 * Body: multipart/form-data with single field "image"
 * Auth: required
 */
router.post('/images', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

  const file = req.file;

  // Public URL for accessing the file (absolute URL so client on different port can load it)
  const base = `${req.protocol}://${req.get('host')}`;
  const urlPath = `${base}/uploads/images/${file.filename}`;

    res.status(201).json({
      message: 'Uploaded successfully',
      file: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: urlPath,
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;
