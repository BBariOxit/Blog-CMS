/**
 * MongoClient.js
 * Quản lý kết nối MongoDB với Mongoose
 */

import mongoose from 'mongoose';
import appConfig from './AppConfig.js';

class MongoClient {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log('📦 MongoDB already connected');
      return;
    }

    try {
      await mongoose.connect(appConfig.mongoUri);
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 MongoDB disconnected');
    } catch (error) {
      console.error('❌ MongoDB disconnect error:', error.message);
    }
  }
}

export default new MongoClient();
