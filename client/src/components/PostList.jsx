/**
 * PostList.jsx
 * List of post cards
 */

import PostCard from './PostCard.jsx';

export default function PostList({ posts, title }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-gray-500 text-xl font-medium">No posts found.</p>
        <p className="text-gray-400 text-sm mt-2">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
