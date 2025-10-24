/**
 * Editor.jsx
 * Tạo/Chỉnh sửa bài viết với preview
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../api/posts.js';
import MarkdownPreview from '../components/MarkdownPreview.jsx';
import authStore from '../store/authStore.js';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auth] = useState(authStore.getState());

  const [formData, setFormData] = useState({
    title: '',
    contentMarkdown: '',
    tags: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      // Get post by ID (need to implement getPostById or use slug)
      // For now, we'll skip edit functionality details
      console.log('Edit mode for post:', id);
    } catch (error) {
      console.error('Failed to load post:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.contentMarkdown) {
      alert('Title and content are required');
      return;
    }

    try {
      setSaving(true);

      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const postData = {
        title: formData.title,
        contentMarkdown: formData.contentMarkdown,
        tags: tagsArray,
      };

      if (id) {
        await postsAPI.updatePost(id, postData);
      } else {
        await postsAPI.createPost(postData);
      }

      navigate('/admin');
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Post' : 'Create New Post'}
        </h1>
        <p className="text-gray-600 mt-2">
          Write your post in Markdown. It will be processed through our{' '}
          <span className="font-semibold text-primary-600">
            Decorator Pipeline
          </span>{' '}
          (Markdown → Sanitize → Highlight → ReadingTime).
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Column */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter post title..."
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="react, javascript, tutorial"
              />
            </div>

            {/* Content Markdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Markdown) *
              </label>
              <textarea
                value={formData.contentMarkdown}
                onChange={(e) =>
                  setFormData({ ...formData, contentMarkdown: e.target.value })
                }
                rows="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                placeholder="# Your Title&#10;&#10;Your content here...&#10;&#10;```javascript&#10;const code = 'example';&#10;```"
                required
              />
            </div>

            {/* Markdown Help */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Markdown Quick Guide:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  <code># Heading</code> - H1 heading
                </li>
                <li>
                  <code>**bold**</code> - Bold text
                </li>
                <li>
                  <code>*italic*</code> - Italic text
                </li>
                <li>
                  <code>[link](url)</code> - Link
                </li>
                <li>
                  <code>```language</code> - Code block
                </li>
              </ul>
            </div>
          </div>

          {/* Preview Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Preview
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {showPreview && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white max-h-[600px] overflow-y-auto">
                <MarkdownPreview markdown={formData.contentMarkdown} />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
