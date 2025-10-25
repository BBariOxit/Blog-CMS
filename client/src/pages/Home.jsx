/**
 * Home.jsx
 * Homepage - Modern Tech Blog
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../api/posts.js';
import PostList from '../components/PostList.jsx';
import Loading from '../components/Loading.jsx';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [latestPage, setLatestPage] = useState(1);
  const [latestHasMore, setLatestHasMore] = useState(true);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [trendingMode, setTrendingMode] = useState('views');
  const [loading, setLoading] = useState(true);
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef(null);
  const [topTags, setTopTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [tagPosts, setTagPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadLatestPosts(1, true);
    loadTopTags();
  }, []);

  useEffect(() => {
    loadTrendingPosts();
  }, [trendingMode]);

  // Close the sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadLatestPosts = async (page = 1, replace = false) => {
    try {
      setLoading(page === 1);
      const data = await postsAPI.getPosts({ limit: 6, page });
      setLatestPosts((prev) => (replace ? data.posts : [...prev, ...data.posts]));
      setLatestPage(page);
      setLatestHasMore(page < (data.pagination?.pages || 1));
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      if (page === 1) setLoading(false);
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

  const loadTopTags = async () => {
    try {
      const data = await postsAPI.getTopTags(12);
      setTopTags(data.tags || []);
    } catch (e) {
      // non-fatal
    }
  };

  // Fetch posts for selected tag
  useEffect(() => {
    const run = async () => {
      if (!selectedTag) { setTagPosts([]); return; }
      const data = await postsAPI.getPosts({ tag: selectedTag, limit: 6 });
      setTagPosts(data.posts || []);
    };
    run();
  }, [selectedTag]);

  // Debounced search
  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!searchQuery.trim()) { setSearchResults([]); setSearchLoading(false); return; }
      try {
        setSearchLoading(true);
        const data = await postsAPI.getPosts({ q: searchQuery.trim(), limit: 6 });
        setSearchResults(data.posts || []);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [searchQuery]);

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

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, or keywords..."
                className="w-full rounded-2xl border-2 border-gray-200 bg-white/70 px-5 py-4 pr-28 text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                Clear
              </button>
            </div>
            {searchQuery && (
              <div className="mt-4 text-left bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">Search Results</h4>
                {searchLoading ? (
                  <p className="text-gray-500">Searching…</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-gray-500">No results for "{searchQuery}"</p>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((post) => (
                      <Link
                        to={`/post/${post.slug}`}
                        key={post._id}
                        className="flex gap-4 rounded-xl border border-gray-200 hover:border-blue-300 bg-white p-3 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-gray-100">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">🖼️</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap gap-2 mb-1">
                            {(post.tags || []).slice(0, 2).map((t) => (
                              <span key={t} className="px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-200">#{t}</span>
                            ))}
                            {post.tags?.length > 2 && (
                              <span className="px-2 py-0.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">+{post.tags.length - 2}</span>
                            )}
                          </div>
                          <h5 className="text-base font-bold text-gray-900 mb-1 truncate">{post.title}</h5>
                          <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><span>⏱️</span>{post.readingTime || 1} min</span>
                            <span className="flex items-center gap-1"><span>👁️</span>{post.views || 0}</span>
                            <span className="flex items-center gap-1"><span>❤️</span>{post.likes || 0}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
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
            
            {/* Sort Options - Custom Dropdown */}
            <div ref={sortRef} className="relative ml-14 md:ml-0">
              <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Sort by:</span>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openSort}
                  onClick={() => setOpenSort((s) => !s)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-lg">
                    {trendingMode === 'views' && '📊'}
                    {trendingMode === 'velocity' && '⚡'}
                    {trendingMode === 'weighted' && '🎯'}
                  </span>
                  <span>
                    {trendingMode === 'views' && 'Most Viewed'}
                    {trendingMode === 'velocity' && 'Fastest Growing'}
                    {trendingMode === 'weighted' && 'Most Engaged'}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${openSort ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {openSort && (
                <ul
                  role="listbox"
                  tabIndex={-1}
                  className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5"
                >
                  {[
                    { value: 'views', label: 'Most Viewed', icon: '📊' },
                    { value: 'velocity', label: 'Fastest Growing', icon: '⚡' },
                    { value: 'weighted', label: 'Most Engaged', icon: '🎯' },
                  ].map((opt) => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={trendingMode === opt.value}
                      onClick={() => {
                        setTrendingMode(opt.value);
                        setOpenSort(false);
                      }}
                      className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-gray-900 hover:bg-blue-50 ${trendingMode === opt.value ? 'bg-blue-50' : ''}`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className="font-medium flex-1">{opt.label}</span>
                      {trendingMode === opt.value && (
                        <svg className="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 00-1.408-1.42l-7.3 7.227-3.293-3.26A1 1 0 003.294 9.26l4 3.962a1 1 0 001.41-.004l8-7.928z" clipRule="evenodd" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              )}
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

      {/* Popular Topics */}
      {topTags.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Popular Topics</h3>
              <p className="text-gray-600 mt-1 ml-0">Browse by tags</p>
            </div>
            {selectedTag && (
              <button onClick={() => setSelectedTag('')} className="text-blue-600 font-semibold hover:underline">Clear filter</button>
            )}
          </div>
          {/* Two evenly split rows */}
          {(() => {
            const perRow = Math.ceil(topTags.length / 2) || 1;
            const first = topTags.slice(0, perRow);
            const second = topTags.slice(perRow);
            const placeholders = Math.max(0, perRow - second.length);
            const Chip = ({ t }) => (
              <button
                key={t.name}
                onClick={() => setSelectedTag(t.name)}
                className={`group flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 border ${selectedTag === t.name
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700 hover:shadow-md'}
                `}
                title={`${t.count} articles`}
              >
                <span className="opacity-80">#{t.name}</span>
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${selectedTag === t.name ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>{t.count}</span>
              </button>
            );
            return (
              <div className="space-y-3 max-w-5xl mx-auto">
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` }}>
                  {first.map((t) => <Chip key={t.name} t={t} />)}
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` }}>
                  {second.map((t) => <Chip key={t.name} t={t} />)}
                  {Array.from({ length: placeholders }).map((_, i) => (
                    <div key={`ph-${i}`} aria-hidden className="opacity-0 select-none">.</div>
                  ))}
                </div>
              </div>
            );
          })()}

          {selectedTag && (
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">#{selectedTag} Articles</h4>
              <PostList posts={tagPosts} />
            </div>
          )}
        </section>
      )}

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
        {latestHasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => loadLatestPosts(latestPage + 1)}
              className="px-6 py-3 rounded-lg bg-white border border-gray-200 font-semibold text-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-700"
            >
              Load more
            </button>
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
