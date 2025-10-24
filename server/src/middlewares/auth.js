/**
 * auth.js - Authentication Middleware
 * Xác thực JWT token và gắn user vào request với security tốt hơn
 */

import jwt from 'jsonwebtoken';
import appConfig from '../config/AppConfig.js';
import User from '../models/User.js';

/**
 * Middleware xác thực JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Authentication required. Please login to continue.',
        code: 'AUTH_TOKEN_MISSING'
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    // Verify token
    const decoded = jwt.verify(token, appConfig.jwtSecret);

    // Tìm user và select passwordHash để có thể dùng comparePassword nếu cần
    const user = await User.findById(decoded.userId).select('+passwordHash');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User account not found. Please login again.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if account is active
    if (user.isActive === false) {
      return res.status(403).json({
        message: 'Your account has been deactivated. Please contact support.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Gắn user vào request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid authentication token. Please login again.',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Your session has expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      message: 'Authentication failed. Please try again.',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware kiểm tra role
 * @param {Array} allowedRoles - Mảng các role được phép
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required.',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        currentRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Optional authentication - không bắt buộc phải login
 * Dùng cho các route có thể access cả khi chưa login và đã login
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Không có token thì next luôn, không throw error
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, appConfig.jwtSecret);
    const user = await User.findById(decoded.userId);
    
    if (user && user.isActive !== false) {
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;
    }
    
    next();
  } catch (error) {
    // Silent fail - không có user thì next luôn
    next();
  }
};
