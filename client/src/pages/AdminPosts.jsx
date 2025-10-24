/**
 * AdminPosts.jsx
 * Quản lý bài viết của user
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../api/posts.js';
import authStore from '../store/authStore.js';
import Loading from '../components/Loading.jsx';

export default function AdminPosts() {
  const navigate = useNavigate();
  const [auth] = useState(authStore.getState());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      // Get all posts (including drafts) - filter client-side for now
      const data = await postsAPI.getPosts({ limit: 100, status: '' });
      
      // Filter posts by current user
      const userPosts = data.posts.filter(
        (post) => post.author?._id === auth.user?._id
      );
      
      setPosts(userPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) {
      return;
    }

    try {
      await postsAPI.deletePost(id);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  const handleToggleStatus = async (post) => {
    // Only editor/admin can publish
    if (!authStore.hasRole(['editor', 'admin'])) {
      alert('Only editors can publish posts');
      return;
    }

    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      await postsAPI.updatePostStatus(post._id, newStatus);
      
      // Update local state
      setPosts(
        posts.map((p) =>
          p._id === post._id ? { ...p, status: newStatus } : p
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 My Posts</h1>
          <p className="text-gray-600 mt-2">Manage your blog posts</p>
        </div>
        <Link
          to="/editor"
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
        >
          <span>✏️</span>
          <span>New Post</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">
            You haven't created any posts yet.
          </p>
          <Link
            to="/editor"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      to={`/post/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>👁️ {post.views}</span>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.commentsCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {authStore.hasRole(['editor', 'admin']) && (
                        <button
                          onClick={() => handleToggleStatus(post)}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            post.status === 'published'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {post.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      )}
                      <Link
                        to={`/editor/${post._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id, post.title)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
