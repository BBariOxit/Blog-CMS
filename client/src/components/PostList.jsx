/**
 * PostList.jsx
 * Modern grid layout for blog posts
 */

import PostCard from './PostCard.jsx';

export default function PostList({ posts, title }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-3xl border-2 border-dashed border-gray-300">
        <div className="text-7xl mb-6 animate-bounce">📭</div>
        <p className="text-gray-700 text-2xl font-bold mb-2">No posts found</p>
        <p className="text-gray-500 text-base">Check back later for fresh content!</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <span className="text-4xl">📚</span>
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
