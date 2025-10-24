/**
 * auth.controller.js
 * Controllers cho authentication
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import appConfig from '../config/AppConfig.js';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    // Validation
    if (!email || !password || !displayName) {
      return res.status(400).json({
        message: 'Email, password và displayName là bắt buộc',
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email đã được sử dụng',
      });
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Tạo user mới
    const user = await User.create({
      email,
      passwordHash,
      displayName,
      role: 'author', // Default role
    });

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id },
      appConfig.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email và password là bắt buộc',
      });
    }

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Email hoặc password không đúng',
      });
    }

    // Kiểm tra password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Email hoặc password không đúng',
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id },
      appConfig.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    res.json({
      user: req.user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
