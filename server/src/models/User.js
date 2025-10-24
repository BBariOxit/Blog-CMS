/**
 * User.js - Mongoose Model
 * Schema cho người dùng (tác giả, biên tập viên, admin)
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['author', 'editor', 'admin'],
      default: 'author',
    },
  },
  {
    timestamps: true,
  }
);

// Method: So sánh password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Static: Hash password
userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

// Ẩn passwordHash khi trả về JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
