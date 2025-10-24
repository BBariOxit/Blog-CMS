/**
 * Home.jsx
 * Homepage với Latest Posts và Trending (Strategy Pattern demo)
 */

import { useState, useEffect } from 'react';
import { postsAPI } from '../api/posts.js';
import PostList from '../components/PostList.jsx';
import Loading from '../components/Loading.jsx';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [trendingMode, setTrendingMode] = useState('views');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestPosts();
  }, []);

  useEffect(() => {
    loadTrendingPosts();
  }, [trendingMode]);

  const loadLatestPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getPosts({ limit: 6 });
      setLatestPosts(data.posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingPosts = async () => {
    try {
      const data = await postsAPI.getTrending(trendingMode);
      setTrendingPosts(data.posts);
    } catch (error) {
      console.error('Failed to load trending posts:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to PaperPress
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern blog CMS built with React & Node.js, demonstrating{' '}
          <span className="font-semibold text-primary-600">
            Decorator
          </span>{' '}
          and{' '}
          <span className="font-semibold text-primary-600">
            Strategy
          </span>{' '}
          design patterns
        </p>
      </div>

      {/* Trending Section - Strategy Pattern Demo */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            🔥 Trending Posts
          </h2>
          
          {/* Strategy Mode Selector */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">
              Ranking Strategy:
            </label>
            <select
              value={trendingMode}
              onChange={(e) => setTrendingMode(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="views">By Views</option>
              <option value="velocity">By Velocity</option>
              <option value="weighted">By Weighted Engagement</option>
            </select>
          </div>
        </div>

        {trendingPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingPosts.slice(0, 4).map((post, index) => (
              <div
                key={post._id}
                className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-lg border border-primary-200 hover:shadow-lg transition"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl font-bold text-primary-600">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>👁️ {post.views}</span>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No trending posts yet.</p>
        )}
      </section>

      {/* Latest Posts Section */}
      <section>
        <PostList posts={latestPosts} title="📰 Latest Posts" />
      </section>
    </div>
  );
}
