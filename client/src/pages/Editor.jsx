/**
 * Editor.jsx
 * Tạo/Chỉnh sửa bài viết với preview và UX chuyên nghiệp
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
    coverImage: '',
  });
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  const blogTemplates = {
    tutorial: `# Tutorial Title

## Introduction
Briefly introduce what readers will learn in this tutorial.

## Prerequisites
- Requirement 1
- Requirement 2

## Step 1: Setup
Explain the first step...

\`\`\`javascript
const example = "code here";
console.log(example);
\`\`\`

## Step 2: Implementation
Continue with implementation details...

## Conclusion
Summarize what was learned.`,
    
    review: `# Product/Service Review

## Overview
Quick summary of what you're reviewing...

## Pros
- Advantage 1
- Advantage 2
- Advantage 3

## Cons
- Disadvantage 1
- Disadvantage 2

## Final Verdict
⭐⭐⭐⭐⭐ (5/5)

My overall thoughts...`,
    
    story: `# Story Title

Once upon a time...

## Chapter 1
Your story begins here...

## Chapter 2
The plot thickens...

## Conclusion
How does it end?`
  };

  const loadTemplate = (templateKey) => {
    if (formData.contentMarkdown && !confirm('This will replace your current content. Continue?')) {
      return;
    }
    setFormData({ ...formData, contentMarkdown: blogTemplates[templateKey] });
    updateCounts(blogTemplates[templateKey]);
  };

  const updateCounts = (text) => {
    setCharacterCount(text.length);
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (!formData.contentMarkdown.trim()) {
      newErrors.contentMarkdown = 'Content is required';
    } else if (formData.contentMarkdown.length < 50) {
      newErrors.contentMarkdown = 'Content must be at least 50 characters';
    }

    // Only validate URL if not using file upload
    if (formData.coverImage && !coverImageFile && !isValidUrl(formData.coverImage)) {
      newErrors.coverImage = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle file upload for cover image
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, coverImage: 'Please select an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, coverImage: 'Image size must be less than 5MB' }));
      return;
    }

    setCoverImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
      setFormData(prev => ({ ...prev, coverImage: reader.result }));
      setErrors(prev => ({ ...prev, coverImage: '' }));
    };
    reader.readAsDataURL(file);
  };

  // Remove cover image
  const handleRemoveCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview('');
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

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
      // Fetch post data by _id for edit mode
      const post = await postsAPI.getPostById(id);

      if (!post) {
        setErrors({ general: 'Bài viết không tồn tại' });
        return;
      }

      // Populate form
      setFormData({
        title: post.title || '',
        contentMarkdown: post.contentMarkdown || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '').toString(),
        coverImage: post.coverImage || '',
      });

      // Set cover preview (if url or data URL)
      if (post.coverImage) {
        setCoverImagePreview(post.coverImage);
      } else {
        setCoverImagePreview('');
      }

      updateCounts(post.contentMarkdown || '');
    } catch (error) {
      console.error('Failed to load post:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag);

      const postData = {
        title: formData.title.trim(),
        contentMarkdown: formData.contentMarkdown.trim(),
        tags: tagsArray,
        coverImage: formData.coverImage.trim(),
        status: 'published', // Auto publish
      };

      if (id) {
        await postsAPI.updatePost(id, postData);
      } else {
        await postsAPI.createPost(postData);
      }

      // Show success message
      setSaveSuccess(true);
      
      // Wait a bit then redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Failed to save post:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to save post. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required to save draft' });
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag);

      const postData = {
        title: formData.title.trim(),
        contentMarkdown: formData.contentMarkdown.trim(),
        tags: tagsArray,
        coverImage: formData.coverImage.trim(),
        status: 'draft',
      };

      if (id) {
        await postsAPI.updatePost(id, postData);
      } else {
        await postsAPI.createPost(postData);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (error) {
      console.error('Failed to save draft:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to save draft. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">Post {id ? 'updated' : 'created'} successfully</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-purple-900 bg-clip-text text-transparent mb-2">
                {id ? '✏️ Edit Post' : '✨ Create New Post'}
              </h1>
              <p className="text-gray-600">
                Write your post in Markdown. It will be processed through our{' '}
                <span className="font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  Decorator Pipeline
                </span>{' '}
                (Markdown → Sanitize → Highlight → ReadingTime).
              </p>
            </div>
            
            {/* Stats */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200">
                <p className="text-2xl font-bold text-primary-600">{wordCount}</p>
                <p className="text-xs text-gray-500">Words</p>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200">
                <p className="text-2xl font-bold text-purple-600">{characterCount}</p>
                <p className="text-xs text-gray-500">Characters</p>
              </div>
            </div>
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl animate-shake">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-700">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Template Selector - Only for new posts */}
        {!id && !formData.contentMarkdown && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span>Quick Start with a Template</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => loadTemplate('tutorial')}
                className="group p-6 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
              >
                <div className="text-4xl mb-3">📚</div>
                <div className="font-bold text-gray-900 text-lg mb-1">Tutorial</div>
                <div className="text-sm text-gray-600">Step-by-step guide format</div>
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('review')}
                className="group p-6 bg-white rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
              >
                <div className="text-4xl mb-3">⭐</div>
                <div className="font-bold text-gray-900 text-lg mb-1">Review</div>
                <div className="text-sm text-gray-600">Product/service review</div>
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('story')}
                className="group p-6 bg-white rounded-xl border-2 border-pink-200 hover:border-pink-400 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
              >
                <div className="text-4xl mb-3">📖</div>
                <div className="font-bold text-gray-900 text-lg mb-1">Story</div>
                <div className="text-sm text-gray-600">Creative writing</div>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Editor */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📝 Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'
                  } rounded-xl focus:outline-none focus:ring-2 transition-all text-lg font-medium`}
                  placeholder="Enter an engaging title..."
                  disabled={saving}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.title}</span>
                  </p>
                )}
                {formData.title && !errors.title && (
                  <p className="mt-2 text-xs text-gray-500">
                    {formData.title.length}/200 characters
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🏷️ Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="react, javascript, tutorial"
                  disabled={saving}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Add tags to help readers find your content
                </p>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🖼️ Cover Image
                </label>
                
                {/* File Upload Button */}
                <div className="flex items-center space-x-3 mb-3">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                      disabled={saving}
                    />
                    <div className={`w-full px-4 py-3 border-2 border-dashed ${
                      errors.coverImage ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } rounded-xl cursor-pointer transition-all text-center group`}>
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600 group-hover:text-primary-600 font-medium transition-colors">
                          📁 Choose from computer
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* OR divider */}
                {!coverImagePreview && (
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-400">OR</span>
                    </div>
                  </div>
                )}

                {/* URL Input (only show if no file uploaded) */}
                {!coverImagePreview && (
                  <>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => {
                        setFormData({ ...formData, coverImage: e.target.value });
                        setCoverImagePreview(e.target.value);
                        if (errors.coverImage) setErrors({ ...errors, coverImage: '' });
                      }}
                      className={`w-full px-4 py-3 border-2 ${
                        errors.coverImage ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'
                      } rounded-xl focus:outline-none focus:ring-2 transition-all`}
                      placeholder="🔗 Or paste image URL (https://...)"
                      disabled={saving}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Try <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium">Unsplash</a> for free images
                    </p>
                  </>
                )}

                {/* Image Preview */}
                {coverImagePreview && (
                  <div className="mt-3 relative group">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      className="w-full h-56 object-cover rounded-xl shadow-lg ring-2 ring-gray-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x400/e5e7eb/6b7280?text=Invalid+Image';
                      }}
                    />
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={handleRemoveCoverImage}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                      disabled={saving}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {/* File info */}
                    {coverImageFile && (
                      <div className="mt-2 text-xs text-gray-600 flex items-center space-x-2">
                        <span>📎</span>
                        <span className="font-medium">{coverImageFile.name}</span>
                        <span className="text-gray-400">•</span>
                        <span>{(coverImageFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {errors.coverImage && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1 animate-shake">
                    <span>⚠️</span>
                    <span>{errors.coverImage}</span>
                  </p>
                )}
              </div>

              {/* Content Markdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ✍️ Content (Markdown) *
                </label>
                <textarea
                  value={formData.contentMarkdown}
                  onChange={(e) => {
                    setFormData({ ...formData, contentMarkdown: e.target.value });
                    updateCounts(e.target.value);
                    if (errors.contentMarkdown) setErrors({ ...errors, contentMarkdown: '' });
                  }}
                  rows="20"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.contentMarkdown ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'
                  } rounded-xl focus:outline-none focus:ring-2 transition-all font-mono text-sm resize-y`}
                  placeholder="# Your Title&#10;&#10;Write your amazing content here...&#10;&#10;```javascript&#10;const code = 'example';&#10;```"
                  disabled={saving}
                />
                {errors.contentMarkdown && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.contentMarkdown}</span>
                  </p>
                )}
                
                {/* Mobile Stats */}
                <div className="md:hidden flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-semibold">{wordCount}</span>
                    <span>words</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-semibold">{characterCount}</span>
                    <span>characters</span>
                  </div>
                </div>

                {/* Markdown Help */}
                <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center space-x-2">
                    <span>💡</span>
                    <span>Markdown Quick Guide:</span>
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded"># Heading</code> - H1 heading</li>
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded">**bold**</code> - Bold text</li>
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded">*italic*</code> - Italic text</li>
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded">[link](url)</code> - Hyperlink</li>
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded">```language```</code> - Code block</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <span>👁️</span>
                    <span>Live Preview</span>
                  </h3>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={() => {
                      const preview = document.getElementById('preview-content');
                      if (preview) {
                        preview.scrollTop = 0;
                      }
                    }}
                  >
                    ⬆️ Top
                  </button>
                </div>
                <div 
                  id="preview-content"
                  className="border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm max-h-[800px] overflow-y-auto"
                >
                  {formData.contentMarkdown ? (
                    <MarkdownPreview content={formData.contentMarkdown} />
                  ) : (
                    <div className="text-center text-gray-400 py-20">
                      <p className="text-6xl mb-4">📝</p>
                      <p className="text-lg font-medium">Start writing to see preview</p>
                      <p className="text-sm mt-2">Your markdown will be rendered here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Cancel
            </button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>💾</span>
                <span>{saving ? 'Saving...' : 'Save Draft'}</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <span>🚀</span>
                <span>{saving ? 'Publishing...' : 'Publish Post'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
