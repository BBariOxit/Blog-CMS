import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../api/posts.js';
import authStore from '../store/authStore.js';
import Loading from '../components/Loading.jsx';

export default function MyPosts() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(authStore.getState());
  const user = auth.user;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const unsub = authStore.subscribe(setAuth);
    // load when user changes
    loadPosts();
    return () => unsub();
  }, [user]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Lấy tất cả posts của user (cả draft và published)
      const data = await postsAPI.getPosts({ 
        author: user._id,
        limit: 100 // Load nhiều posts
      });
      
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(err.response?.data?.message || 'Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) {
      return;
    }

    try {
      setDeleting(postId);
      await postsAPI.deletePost(postId);
      
      // Remove from list
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.message || 'Không thể xóa bài viết');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (post) => {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      const updatedPost = await postsAPI.updatePostStatus(post._id, newStatus);
      
      // Update in list
      setPosts(posts.map(p => p._id === post._id ? updatedPost : p));
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              📝 My Posts
            </h1>
            <p className="text-slate-600 mt-2">Manage your blog posts</p>
          </div>
          
          <Link
            to="/editor"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            ✏️ New Post
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-slate-500 text-lg mb-6">You haven't created any posts yet.</p>
            <Link
              to="/editor"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status === 'published' ? '✓ Published' : '📝 Draft'}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <span>📅 {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span>👁️ {post.views} views</span>
                      <span>❤️ {post.likes} likes</span>
                      <span>💬 {post.commentsCount || 0} comments</span>
                      {post.readingTime && <span>⏱️ {post.readingTime}</span>}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 5).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/editor/${post._id}`}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-center"
                    >
                      ✏️ Edit
                    </Link>
                    
                    <button
                      onClick={() => handleToggleStatus(post)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        post.status === 'published'
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {post.status === 'published' ? '📝 Unpublish' : '✓ Publish'}
                    </button>

                    <Link
                      to={`/posts/${post.slug}`}
                      className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors text-center"
                    >
                      👁️ View
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={deleting === post._id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deleting === post._id ? '⏳' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
