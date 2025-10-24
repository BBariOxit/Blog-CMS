/**
 * PostCard.jsx
 * Card component cho hiển thị post preview
 */

import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
      {/* Cover Image with Overlay Effect */}
      {post.coverImage && (
        <Link to={`/post/${post.slug}`} className="block relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.parentElement.style.display = 'none';
            }}
          />
          {/* View Count Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg z-20">
            <span className="text-sm font-semibold text-gray-700">👁️ {post.views}</span>
          </div>
        </Link>
      )}

      <div className="p-6 space-y-4">
        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        {/* Author & Reading Time */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {post.author?.displayName?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium text-gray-700">{post.author?.displayName || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">⏱️ {post.readingTime} min read</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full border border-primary-200 hover:border-primary-300 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Excerpt */}
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {post.contentMarkdown?.substring(0, 150)}...
        </p>

        {/* Footer: Stats & Read More */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1 hover:text-red-500 transition-colors cursor-pointer">
              <span>❤️</span>
              <span className="font-medium">{post.likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>💬</span>
              <span className="font-medium">{post.commentsCount || 0}</span>
            </span>
          </div>
          
          <Link
            to={`/post/${post.slug}`}
            className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
          >
            <span>Read more</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
