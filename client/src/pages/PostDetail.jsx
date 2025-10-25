/**
 * PostDetail.jsx
 * Chi tiết bài viết với HTML đã được xử lý qua Decorator Pipeline
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postsAPI } from '../api/posts.js';
import Loading from '../components/Loading.jsx';

// Import highlight.js theme
import 'highlight.js/styles/github-dark.css';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    authorName: '',
    content: '',
  });

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await postsAPI.getPostBySlug(slug);
      setPost(postData);

      const commentsData = await postsAPI.getComments(postData._id);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await postsAPI.likePost(post._id);
      setPost({ ...post, likes: post.likes + 1 });
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.authorName || !commentForm.content) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await postsAPI.createComment(post._id, commentForm);
      setCommentForm({ authorName: '', content: '' });
      
      // Reload comments
      const commentsData = await postsAPI.getComments(post._id);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('Failed to post comment');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Post Header */}
        <article>
          <header className="mb-12">
            {/* Cover Image with Parallax Effect */}
            {post.coverImage && (
              <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    e.target.parentElement.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Title Overlay on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                    {post.title}
                  </h1>
                  {/* Draft Badge for cover image posts */}
                  {post.status === 'draft' && (
                    <span className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-bold border-2 border-yellow-300 shadow-lg">
                      📝 Draft - Only visible to you
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Title if no cover image */}
            {!post.coverImage && (
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                  {post.title}
                </h1>
                {/* Draft Badge for non-cover posts */}
                {post.status === 'draft' && (
                  <div className="mb-6">
                    <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold border-2 border-yellow-300">
                      📝 Draft - Only visible to you
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Author Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {post.author?.displayName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {post.author?.displayName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <span className="flex items-center space-x-2 text-gray-600">
                    <span>⏱️</span>
                    <span className="font-medium">{post.readingTime} min read</span>
                  </span>
                  <span className="flex items-center space-x-2 text-gray-600">
                    <span>👁️</span>
                    <span className="font-medium">{post.views} views</span>
                  </span>
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-full transition-all duration-200 transform hover:scale-105"
                  >
                    <span className="text-red-500">❤️</span>
                    <span className="font-bold text-red-600">{post.likes}</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 text-sm font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full border border-primary-200 hover:border-primary-300 transition-all hover:shadow-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

        {/* Post Content - HTML từ server (đã qua Decorator Pipeline) */}
        <div
          className="prose prose-lg max-w-none bg-white rounded-xl shadow-lg p-8 mb-12
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:pb-4 prose-h1:border-b prose-h1:border-gray-200
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
            prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-700
            prose-a:text-primary-600 prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-primary-700
            prose-code:bg-primary-50 prose-code:text-primary-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-semibold
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:overflow-x-auto
            prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-primary-50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-em:text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.contentHTML }}
        />
      </article>

      {/* Comments Section */}
      <section className="mt-16 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
          <span className="text-4xl">💬</span>
          <span>Comments ({comments.length})</span>
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-10 bg-gradient-to-br from-gray-50 to-primary-50 p-6 rounded-xl border-2 border-primary-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Leave a comment</h3>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Leave a comment</h3>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={commentForm.authorName}
              onChange={(e) =>
                setCommentForm({ ...commentForm, authorName: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comment *
            </label>
            <textarea
              value={commentForm.content}
              onChange={(e) =>
                setCommentForm({ ...commentForm, content: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="Share your thoughts..."
              required
            />
          </div>

          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Post Comment ✨
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment! 💭
            </p>
          )}
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {comment.authorName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">
                    {comment.authorName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed pl-13">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
