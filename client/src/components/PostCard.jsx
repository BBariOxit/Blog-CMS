/**
 * PostCard.jsx
 * Modern blog post card component
 */

import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200 flex flex-col h-full">
      {/* Cover Image */}
      <Link to={`/post/${post.slug}`} className="block relative overflow-hidden h-56 bg-gradient-to-br from-gray-100 to-gray-200">
        {post.coverImage ? (
          <>
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
            <div className="text-center text-white">
              <div className="text-6xl mb-2">📝</div>
              <p className="text-sm font-semibold opacity-90">Blog Post</p>
            </div>
          </div>
        )}
        
        {/* Reading Time Badge */}
        {post.readingTime && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg z-10">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <span>⏱️</span>
              <span>{post.readingTime} phút</span>
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <Link to={`/post/${post.slug}`} className="block mb-3">
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1 text-sm">
          {post.excerpt || post.contentMarkdown?.substring(0, 150) + '...' || 'No preview available'}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Author Info */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-blue-100">
              {post.author?.displayName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-tight">
                {post.author?.displayName || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500 leading-tight">{formattedDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer" title="Views">
              <span>👁️</span>
              <span className="font-semibold">{post.views?.toLocaleString() || 0}</span>
            </span>
            <span className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors cursor-pointer" title="Likes">
              <span>❤️</span>
              <span className="font-semibold">{post.likes || 0}</span>
            </span>
            <span className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer" title="Comments">
              <span>💬</span>
              <span className="font-semibold">{post.commentsCount || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
