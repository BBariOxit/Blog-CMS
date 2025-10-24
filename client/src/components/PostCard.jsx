/**
 * PostCard.jsx
 * Card component cho hiển thị post preview
 */

import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Cover Image */}
      {post.coverImage && (
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Link>
      )}

      <div className="p-6">
        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition mb-2">
            {post.title}
          </h3>
        </Link>

        {/* Meta info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span>👤 {post.author?.displayName || 'Anonymous'}</span>
          <span>⏱️ {post.readingTime} min read</span>
          <span>👁️ {post.views} views</span>
          <span>❤️ {post.likes}</span>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        <p className="text-gray-600 line-clamp-3">
          {post.contentMarkdown?.substring(0, 150)}...
        </p>

        {/* Read more */}
        <Link
          to={`/post/${post.slug}`}
          className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
