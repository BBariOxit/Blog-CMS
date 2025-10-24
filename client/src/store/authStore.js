/**
 * authStore.js
 * Simple state management cho authentication (không dùng Redux/Zustand)
 */

import { authAPI } from '../api/auth.js';

class AuthStore {
  constructor() {
    this.listeners = [];
    this.user = this.loadUser();
    this.token = this.loadToken();
  }

  loadUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  loadToken() {
    return localStorage.getItem('token') || null;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  getState() {
    return {
      user: this.user,
      token: this.token,
      isAuthenticated: !!this.token,
    };
  }

  async login(email, password) {
    try {
      const response = await authAPI.login({ email, password });
      
      // Server trả về { message, token, user }
      const { token, user } = response;
      
      if (!token || !user) {
        console.error('Invalid response from server:', response);
        return {
          success: false,
          error: 'Invalid server response. Please try again.',
        };
      }

      this.token = token;
      this.user = user;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      this.notify();
      return { success: true, user: user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed. Please try again.',
      };
    }
  }

  async register(email, password, displayName) {
    try {
      const response = await authAPI.register({ email, password, displayName });
      
      // Server trả về { message, token, user }
      const { token, user } = response;
      
      if (!token || !user) {
        console.error('Invalid response from server:', response);
        return {
          success: false,
          error: 'Invalid server response. Please try again.',
        };
      }

      this.token = token;
      this.user = user;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      this.notify();
      return { success: true, user: user };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Registration failed. Please try again.',
      };
    }
  }

  logout() {
    this.token = null;
    this.user = null;

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.notify();
  }

  hasRole(roles) {
    if (!this.user) return false;
    return roles.includes(this.user.role);
  }
}

export default new AuthStore();
