/**
 * Login.jsx
 * Login/Register page với validation và UX chuyên nghiệp
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore.js';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateDisplayName = (name) => {
    return name.trim().length >= 2;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required';
      } else if (!validateDisplayName(formData.displayName)) {
        newErrors.displayName = 'Display name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await authStore.login(formData.email, formData.password);
      } else {
        result = await authStore.register(
          formData.email,
          formData.password,
          formData.displayName
        );
      }

      if (result.success) {
        // Clear form
        setFormData({ email: '', password: '', displayName: '' });
        // Navigate to home
        navigate('/');
      } else {
        setErrors({ general: result.error || 'Authentication failed. Please try again.' });
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrors({ general: 'An unexpected error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password, displayName: '' });
    setErrors({});
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: '', password: '', displayName: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-purple-900 bg-clip-text text-transparent mb-3">
            {isLogin ? 'Welcome Back! 👋' : 'Join PaperPress ✨'}
          </h1>
          <p className="text-lg text-gray-600">
            {isLogin
              ? 'Login to manage your amazing blog posts'
              : 'Create an account and start writing today'}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl animate-shake">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border-2 ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'
                  } rounded-lg focus:outline-none focus:ring-2 transition-all`}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Display Name Field (Sign Up Only) */}
            {!isLogin && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Display Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => {
                      setFormData({ ...formData, displayName: e.target.value });
                      if (errors.displayName) setErrors({ ...errors, displayName: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border-2 ${
                      errors.displayName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'
                    } rounded-lg focus:outline-none focus:ring-2 transition-all`}
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
                {errors.displayName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.displayName}</span>
                  </p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full pl-10 pr-12 py-3 border-2 ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'
                  } rounded-lg focus:outline-none focus:ring-2 transition-all`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.password}</span>
                </p>
              )}
              {!isLogin && !errors.password && (
                <p className="mt-2 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>{isLogin ? 'Login to Dashboard' : 'Create Account'}</span>
                  <span>→</span>
                </span>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Sign up for free →"
                : 'Already have an account? Login →'}
            </button>
          </div>

          {/* Demo Accounts */}
          {isLogin && (
            <div className="mt-8 pt-6 border-t-2 border-gray-100">
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                <span>🎯</span>
                <span>Quick Login (Demo Accounts)</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('author@example.com', 'password')}
                  className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 rounded-lg transition-all text-left group"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      A
                    </div>
                    <span className="font-bold text-gray-900 text-sm">Author</span>
                  </div>
                  <p className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                    Click to auto-fill
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleQuickLogin('editor@example.com', 'password')}
                  className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 rounded-lg transition-all text-left group"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      E
                    </div>
                    <span className="font-bold text-gray-900 text-sm">Editor</span>
                  </div>
                  <p className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                    Click to auto-fill
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your data is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
