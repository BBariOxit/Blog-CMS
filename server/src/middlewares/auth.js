/**
 * auth.js - Authentication Middleware
 * Xác thực JWT token và gắn user vào request
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
        message: 'Access token không hợp lệ hoặc không được cung cấp' 
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    // Verify token
    const decoded = jwt.verify(token, appConfig.jwtSecret);

    // Tìm user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User không tồn tại' 
      });
    }

    // Gắn user vào request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn' });
    }
    return res.status(500).json({ message: 'Lỗi xác thực' });
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
        message: 'Chưa xác thực' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Yêu cầu role: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};
