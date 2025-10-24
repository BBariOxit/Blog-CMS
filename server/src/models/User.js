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
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Don't include in queries by default
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      minlength: [2, 'Display name must be at least 2 characters'],
      maxlength: [50, 'Display name must not exceed 50 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['author', 'editor', 'admin'],
        message: 'Role must be author, editor, or admin'
      },
      default: 'author',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio must not exceed 500 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
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
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Pre-save hook: Update lastLogin
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

// Ẩn passwordHash khi trả về JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
