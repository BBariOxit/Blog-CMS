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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-primary-100 to-purple-100 rounded-full">
            <span className="text-primary-700 font-semibold text-sm">✨ Design Patterns in Action</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-purple-900 bg-clip-text text-transparent mb-6">
            Welcome to PaperPress
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A modern blog CMS built with React & Node.js, demonstrating{' '}
            <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">
              Decorator Pattern
            </span>{' '}
            and{' '}
            <span className="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
              Strategy Pattern
            </span>
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 border border-gray-200">
              🎨 Beautiful UI
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 border border-gray-200">
              📝 Markdown Editor
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 border border-gray-200">
              🚀 Real-time Preview
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 border border-gray-200">
              💬 Comments System
            </span>
          </div>
        </div>

        {/* Trending Section - Strategy Pattern Demo */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 flex items-center space-x-3">
              <span className="text-5xl">🔥</span>
              <span>Trending Posts</span>
            </h2>
            
            {/* Strategy Mode Selector */}
            <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200">
              <label className="text-sm font-semibold text-gray-700">
                Ranking Strategy:
              </label>
            <select
              value={trendingMode}
              onChange={(e) => setTrendingMode(e.target.value)}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:from-primary-700 hover:to-purple-700 transition-all cursor-pointer"
            >
              <option value="views" className="bg-white text-gray-900">📊 By Views</option>
              <option value="velocity" className="bg-white text-gray-900">⚡ By Velocity</option>
              <option value="weighted" className="bg-white text-gray-900">🎯 By Weighted Engagement</option>
            </select>
            </div>
          </div>

        {trendingPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {trendingPosts.slice(0, 4).map((post, index) => (
              <div
                key={post._id}
                className="relative bg-gradient-to-br from-white via-primary-50 to-purple-50 p-6 rounded-2xl border-2 border-primary-200 hover:border-primary-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
              >
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg z-10">
                  {index + 1}
                </div>
                
                {/* Cover Image Thumbnail */}
                {post.coverImage && (
                  <div className="mb-4 ml-16">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className={post.coverImage ? "ml-0" : "ml-16"}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm font-medium">
                    <span className="flex items-center space-x-1 text-gray-700">
                      <span>👁️</span>
                      <span>{post.views}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-red-600">
                      <span>❤️</span>
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-blue-600">
                      <span>💬</span>
                      <span>{post.commentsCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No trending posts yet. 🌟</p>
          </div>
        )}
      </section>

      {/* Latest Posts Section */}
      <section className="mt-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
          <span className="text-5xl">📰</span>
          <span>Latest Posts</span>
        </h2>
        <PostList posts={latestPosts} />
      </section>
      </div>
    </div>
  );
}
