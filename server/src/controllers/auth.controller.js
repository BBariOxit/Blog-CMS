/**
 * auth.controller.js
 * Controllers cho authentication với validation chuyên nghiệp
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import appConfig from '../config/AppConfig.js';

/**
 * Validation helpers
 */
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateDisplayName = (name) => {
  return name && name.trim().length >= 2;
};

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    // Detailed validation
    if (!email || !password || !displayName) {
      return res.status(400).json({
        message: 'All fields are required',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          displayName: !displayName ? 'Display name is required' : null,
        }
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
      });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    // Validate display name
    if (!validateDisplayName(displayName)) {
      return res.status(400).json({
        message: 'Display name must be at least 2 characters long',
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'This email is already registered. Please login instead.',
      });
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Tạo user mới với email lowercase
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName.trim(),
      role: 'author', // Default role
    });

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      appConfig.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    // Handle unique constraint errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This email is already registered',
      });
    }
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
        message: 'Email and password are required',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
        }
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
      });
    }

    // Tìm user (case-insensitive email) và PHẢI select passwordHash để compare
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Kiểm tra password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (user.isActive === false) {
      return res.status(403).json({
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Tạo JWT token với thông tin đầy đủ
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      appConfig.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
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
