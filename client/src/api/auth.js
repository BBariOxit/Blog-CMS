/**
 * auth.js
 * API calls cho authentication
 */

import http from './http.js';

export const authAPI = {
  /**
   * Register new user
   */
  register: async (data) => {
    const response = await http.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data) => {
    const response = await http.post('/auth/login', data);
    return response.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await http.get('/auth/me');
    return response.data;
  },
};
