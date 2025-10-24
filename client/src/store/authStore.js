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
      const data = await authAPI.login({ email, password });
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      this.notify();
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  }

  async register(email, password, displayName) {
    try {
      const data = await authAPI.register({ email, password, displayName });
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      this.notify();
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
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
