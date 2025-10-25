/**
 * comments.controller.js
 * Controllers cho comments
 */

import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

/**
 * Get comments của một post
 * GET /api/posts/:postId/comments
 */
export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      post: postId,
      isApproved: true,
    })
      .populate('author', 'displayName email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * Create comment
 * POST /api/posts/:postId/comments
 * Support both authenticated and guest comments
 */
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { authorName, content } = req.body;
    const user = req.user; // From optionalAuth middleware

    if (!content) {
      return res.status(400).json({
        message: 'Content là bắt buộc',
      });
    }

    // Kiểm tra post có tồn tại không
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Bài viết không tồn tại',
      });
    }

    // Nếu user đã đăng nhập, dùng thông tin từ user
    // Nếu không, yêu cầu authorName
    let commentData = {
      post: postId,
      content,
      isApproved: true, // Auto-approve
    };

    if (user) {
      // Authenticated user
      commentData.author = user._id;
      commentData.authorName = user.displayName || user.email;
    } else {
      // Guest comment
      if (!authorName) {
        return res.status(400).json({
          message: 'AuthorName là bắt buộc cho guest comments',
        });
      }
      commentData.authorName = authorName;
    }

    // Tạo comment
    const comment = await Comment.create(commentData);

    // Populate author nếu có
    await comment.populate('author', 'displayName email');

    // Tăng commentsCount của post
    post.commentsCount += 1;
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * Approve/unapprove comment (editor/admin only)
 * PATCH /api/comments/:id/approve
 */
export const approveComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment không tồn tại',
      });
    }

    comment.isApproved = !!isApproved;
    await comment.save();

    res.json(comment);
  } catch (error) {
    next(error);
  }
};
