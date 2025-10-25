/**
 * uploads.js
 * API for media uploads
 */

import http from './http.js';

export const uploadsAPI = {
  uploadImage: async (file, onUploadProgress) => {
    const form = new FormData();
    form.append('image', file);
    const response = await http.post('/uploads/images', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return response.data.file; // { url, filename, ... }
  },
};
