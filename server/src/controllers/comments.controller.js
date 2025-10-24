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
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * Create comment
 * POST /api/posts/:postId/comments
 */
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { authorName, content } = req.body;

    if (!authorName || !content) {
      return res.status(400).json({
        message: 'authorName và content là bắt buộc',
      });
    }

    // Kiểm tra post có tồn tại không
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Bài viết không tồn tại',
      });
    }

    // Tạo comment
    const comment = await Comment.create({
      post: postId,
      authorName,
      content,
      isApproved: true, // Auto-approve
    });

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
