/**
 * posts.controller.js
 * Controllers cho posts (sử dụng Decorator Pattern & Strategy Pattern)
 */

import Post from '../models/Post.js';
import { slugify, makeUniqueSlug } from '../utils/slugify.js';
import { processPostContent, generateExcerpt } from '../utils/buildContent.js';
import TrendingContext from '../services/Trending/TrendingContext.js';
import ByViewsStrategy from '../services/Trending/ByViewsStrategy.js';
import ByVelocityStrategy from '../services/Trending/ByVelocityStrategy.js';
import ByWeightedEngagementStrategy from '../services/Trending/ByWeightedEngagementStrategy.js';

/**
 * Get all posts với filtering & pagination
 * GET /api/posts?q=...&tag=...&status=...&page=1&limit=10
 */
export const getPosts = async (req, res, next) => {
  try {
    const {
      q, // Search query
      tag, // Filter by tag
      status, // Filter by status (draft/published)
      author, // Filter by author ID
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Filter by status
    if (status) {
      query.status = status;
    } else if (!author) {
      // Default: chỉ hiển thị published posts nếu không có filter và không filter theo author
      query.status = 'published';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(query)
      .populate('author', 'displayName email')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single post by slug
 * GET /api/posts/:slug
 */
export const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Determine access level based on optional authenticated user
    const user = req.user;

    let updatedPost = null;

    // Case 1: no user - only allow published posts
    if (!user) {
      updatedPost = await Post.findOneAndUpdate(
        { slug, status: 'published' },
        { $inc: { views: 1 } },
        { new: true }
      ).populate('author', 'displayName email role');
    } else if (['editor', 'admin'].includes(user.role)) {
      // Case 2: privileged users (editor/admin) can view any post
      updatedPost = await Post.findOneAndUpdate(
        { slug },
        { $inc: { views: 1 } },
        { new: true }
      ).populate('author', 'displayName email role');
    } else {
      // Case 3: authenticated user (including author role) 
      // - allow published posts OR own posts (including drafts)
      updatedPost = await Post.findOneAndUpdate(
        { slug, $or: [{ status: 'published' }, { author: user._id }] },
        { $inc: { views: 1 } },
        { new: true }
      ).populate('author', 'displayName email role');
    }

    if (!updatedPost) {
      // Not found or not allowed
      return res.status(404).json({ message: 'Bài viết không tồn tại hoặc bạn không có quyền xem' });
    }

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

/**
 * Get post by ID (for edit) - does NOT increment views
 * GET /api/posts/id/:id
 */
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'displayName email role');

    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new post (sử dụng Decorator Pattern)
 * POST /api/posts
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, contentMarkdown, tags, coverImage, status } = req.body;

    if (!title || !contentMarkdown) {
      return res.status(400).json({
        message: 'Title và contentMarkdown là bắt buộc',
      });
    }

    // Validate status
    const postStatus = status === 'published' ? 'published' : 'draft';

    // Tạo slug
    const baseSlug = slugify(title);
    const slug = await makeUniqueSlug(
      baseSlug,
      async (s) => !!(await Post.findOne({ slug: s }))
    );

    // Xử lý content qua Decorator Pipeline
    const processedContent = await processPostContent({
      contentMarkdown,
    });

    // Generate excerpt từ markdown
    const excerpt = generateExcerpt(contentMarkdown, 200);

    // Tạo post
    const post = await Post.create({
      title,
      slug,
      author: req.user._id,
      contentMarkdown,
      contentHTML: processedContent.contentHTML,
      readingTime: processedContent.readingTime,
      excerpt,
      tags: Array.isArray(tags) ? tags : [],
      coverImage: coverImage || '',
      status: postStatus,
      publishedAt: postStatus === 'published' ? new Date() : null,
    });

    await post.populate('author', 'displayName email');

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * Update post (sử dụng Decorator Pattern)
 * PUT /api/posts/:id
 */
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, contentMarkdown, tags, coverImage } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Bài viết không tồn tại',
      });
    }

    // Kiểm tra quyền (chỉ author hoặc admin)
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Bạn không có quyền chỉnh sửa bài viết này',
      });
    }

    // Cập nhật title & slug nếu có
    if (title && title !== post.title) {
      post.title = title;
      const baseSlug = slugify(title);
      post.slug = await makeUniqueSlug(
        baseSlug,
        async (s) => {
          const existing = await Post.findOne({ slug: s });
          return existing && existing._id.toString() !== id;
        }
      );
    }

    // Cập nhật content nếu có
    if (contentMarkdown) {
      post.contentMarkdown = contentMarkdown;

      // Chạy lại Decorator Pipeline
      const processedContent = await processPostContent({
        contentMarkdown,
      });

      post.contentHTML = processedContent.contentHTML;
      post.readingTime = processedContent.readingTime;
      
      // Update excerpt
      post.excerpt = generateExcerpt(contentMarkdown, 200);
    }

    // Cập nhật tags
    if (tags) {
      post.tags = Array.isArray(tags) ? tags : [];
    }

    // Cập nhật coverImage
    if (coverImage !== undefined) {
      post.coverImage = coverImage;
    }

    await post.save();
    await post.populate('author', 'displayName email');

    res.json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * Update post status (publish/unpublish)
 * PATCH /api/posts/:id/status
 */
export const updatePostStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({
        message: 'Status phải là draft hoặc published',
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Bài viết không tồn tại',
      });
    }

    // Kiểm tra quyền (editor hoặc admin)
    if (!['editor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Yêu cầu role editor hoặc admin',
      });
    }

    // Nếu publish lần đầu, set publishedAt
    if (status === 'published' && post.status === 'draft') {
      post.publishedAt = new Date();
    }

    post.status = status;
    await post.save();

    res.json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * Like post
 * PATCH /api/posts/:id/like
 */
export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Bài viết không tồn tại',
      });
    }

    post.likes += 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete post
 * DELETE /api/posts/:id
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Bài viết không tồn tại',
      });
    }

    // Kiểm tra quyền (author hoặc admin)
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Bạn không có quyền xoá bài viết này',
      });
    }

    await post.deleteOne();

    res.json({
      message: 'Đã xoá bài viết',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trending posts (sử dụng Strategy Pattern)
 * GET /api/trending?mode=views|velocity|weighted
 */
export const getTrending = async (req, res, next) => {
  try {
    const { mode = 'views' } = req.query;

    // Lấy posts published
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'displayName')
      .lean();

    // Chọn strategy dựa trên mode
    let strategy;
    switch (mode) {
      case 'velocity':
        strategy = new ByVelocityStrategy();
        break;
      case 'weighted':
        strategy = new ByWeightedEngagementStrategy();
        break;
      case 'views':
      default:
        strategy = new ByViewsStrategy();
        break;
    }

    // Sử dụng TrendingContext
    const context = new TrendingContext(strategy);
    const trendingPosts = context.getTrending(posts, 10);

    res.json({
      mode,
      posts: trendingPosts,
    });
  } catch (error) {
    next(error);
  }
};
