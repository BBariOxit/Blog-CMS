/**
 * AppConfig.js - Singleton Pattern
 * Quản lý cấu hình ứng dụng từ .env
 */

import dotenv from 'dotenv';

dotenv.config();

class AppConfig {
  constructor() {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }

    this.port = process.env.PORT || 4000;
    this.mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/paperpress';
    this.jwtSecret = process.env.JWT_SECRET || 'devsecret';
    this.corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
    this.nodeEnv = process.env.NODE_ENV || 'development';

    AppConfig.instance = this;
  }

  static getInstance() {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }
}

// Export singleton instance
export default AppConfig.getInstance();
