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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Post Header */}
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* Meta info */}
          <div className="flex items-center space-x-6 text-gray-600 mb-4">
            <span className="flex items-center">
              👤 {post.author?.displayName}
            </span>
            <span>⏱️ {post.readingTime} min read</span>
            <span>👁️ {post.views} views</span>
            <button
              onClick={handleLike}
              className="flex items-center hover:text-red-500 transition"
            >
              ❤️ {post.likes}
            </button>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content - HTML từ server (đã qua Decorator Pipeline) */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-4
            prose-h2:text-2xl prose-h2:mb-3
            prose-h3:text-xl prose-h3:mb-2
            prose-p:mb-4 prose-p:leading-relaxed
            prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
            prose-img:rounded-lg prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4
            prose-ul:list-disc prose-ol:list-decimal"
          dangerouslySetInnerHTML={{ __html: post.contentHTML }}
        />
      </article>

      {/* Comments Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          💬 Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={commentForm.authorName}
              onChange={(e) =>
                setCommentForm({ ...commentForm, authorName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              value={commentForm.content}
              onChange={(e) =>
                setCommentForm({ ...commentForm, content: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Share your thoughts..."
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
          >
            Post Comment
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-gray-900">
                  {comment.authorName}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
