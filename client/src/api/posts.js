/**
 * posts.js
 * API calls cho posts
 */

import http from './http.js';

export const postsAPI = {
  /**
   * Get all posts với filters
   */
  getPosts: async (params = {}) => {
    const response = await http.get('/posts', { params });
    return response.data;
  },

  /**
   * Get post by slug
   */
  getPostBySlug: async (slug) => {
    const response = await http.get(`/posts/${slug}`);
    return response.data;
  },

  /**
   * Create new post
   */
  createPost: async (data) => {
    const response = await http.post('/posts', data);
    return response.data;
  },

  /**
   * Update post
   */
  updatePost: async (id, data) => {
    const response = await http.put(`/posts/${id}`, data);
    return response.data;
  },

  /**
   * Update post status
   */
  updatePostStatus: async (id, status) => {
    const response = await http.patch(`/posts/${id}/status`, { status });
    return response.data;
  },

  /**
   * Like post
   */
  likePost: async (id) => {
    const response = await http.patch(`/posts/${id}/like`);
    return response.data;
  },

  /**
   * Delete post
   */
  deletePost: async (id) => {
    const response = await http.delete(`/posts/${id}`);
    return response.data;
  },

  /**
   * Get trending posts
   */
  getTrending: async (mode = 'views') => {
    const response = await http.get('/trending', { params: { mode } });
    return response.data;
  },

  /**
   * Get comments for a post
   */
  getComments: async (postId) => {
    const response = await http.get(`/posts/${postId}/comments`);
    return response.data;
  },

  /**
   * Create comment
   */
  createComment: async (postId, data) => {
    const response = await http.post(`/posts/${postId}/comments`, data);
    return response.data;
  },
};
