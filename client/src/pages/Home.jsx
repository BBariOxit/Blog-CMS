/**
 * Home.jsx
 * Homepage - Modern Tech Blog
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
          <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-full border border-blue-200 shadow-sm">
            <span className="text-blue-700 font-semibold text-sm">💡 Tech Insights & Tutorials</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6 leading-tight">
            Welcome to PaperPress
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-2">
            Discover the latest in web development, programming tutorials, and tech innovations.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Join our community of developers sharing knowledge and building the future.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <span className="px-5 py-2.5 bg-white rounded-full shadow-md text-sm font-semibold text-gray-700 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all">
              🎨 Modern UI
            </span>
            <span className="px-5 py-2.5 bg-white rounded-full shadow-md text-sm font-semibold text-gray-700 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all">
              📝 Quality Content
            </span>
            <span className="px-5 py-2.5 bg-white rounded-full shadow-md text-sm font-semibold text-gray-700 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all">
              🚀 Fast & Responsive
            </span>
            <span className="px-5 py-2.5 bg-white rounded-full shadow-md text-sm font-semibold text-gray-700 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all">
              💬 Active Community
            </span>
          </div>
        </div>

        {/* Trending Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-5xl">🔥</span>
                <span>Trending Now</span>
              </h2>
              <p className="text-gray-600 mt-2 ml-14">Most popular articles this week</p>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md border border-gray-200 ml-14 md:ml-0">
              <label className="text-sm font-semibold text-gray-700">
                Sort by:
              </label>
            <select
              value={trendingMode}
              onChange={(e) => setTrendingMode(e.target.value)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shadow-sm"
            >
              <option value="views" className="bg-white text-gray-900">📊 Most Viewed</option>
              <option value="velocity" className="bg-white text-gray-900">⚡ Fastest Growing</option>
              <option value="weighted" className="bg-white text-gray-900">🎯 Most Engaged</option>
            </select>
            </div>
          </div>

        {trendingPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingPosts.slice(0, 4).map((post, index) => (
              <div
                key={post._id}
                className="relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg z-10 ring-4 ring-white">
                  #{index + 1}
                </div>
                
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="mb-4 ml-16">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className={post.coverImage ? "mt-4" : "ml-16"}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  
                  {/* Author & Date */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {post.author?.displayName?.charAt(0) || 'A'}
                    </div>
                    <span className="font-medium">{post.author?.displayName || 'Anonymous'}</span>
                    <span className="text-gray-400">•</span>
                    <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors">
                      <span>👁️</span>
                      <span>{post.views.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors">
                      <span>❤️</span>
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors">
                      <span>💬</span>
                      <span>{post.commentsCount || 0}</span>
                    </span>
                    {post.readingTime && (
                      <span className="flex items-center gap-1.5 text-gray-500 ml-auto">
                        <span>⏱️</span>
                        <span>{post.readingTime} min</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600 text-lg font-medium">No trending posts yet</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for popular content!</p>
          </div>
        )}
      </section>

      {/* Latest Posts Section */}
      <section className="mt-20">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-5xl">📰</span>
            <span>Latest Articles</span>
          </h2>
          <p className="text-gray-600 mt-2 ml-14">Fresh content from our community</p>
        </div>
        <PostList posts={latestPosts} />
      </section>
      </div>
    </div>
  );
}
