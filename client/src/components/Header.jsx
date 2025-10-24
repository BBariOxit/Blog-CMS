/**
 * Header.jsx
 * Navigation header component
 */

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authStore from '../store/authStore.js';

export default function Header() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setAuth);
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    authStore.logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600">
              📝 PaperPress
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              🏠 Home
            </Link>

            {auth.isAuthenticated && (
              <>
                <Link
                  to="/editor"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition"
                >
                  ✏️ New Post
                </Link>
                <Link
                  to="/my-posts"
                  className="text-gray-700 hover:text-primary-600 transition font-medium"
                >
                  📚 My Posts
                </Link>
              </>
            )}

            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  👤 {auth.user?.displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
