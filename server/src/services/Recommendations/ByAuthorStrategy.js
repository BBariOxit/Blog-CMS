import Post from '../../models/Post.js';

/**
 * ByAuthorStrategy
 * Gợi ý bài viết khác cùng tác giả
 */
export default class ByAuthorStrategy {
  async recommend(post, { limit = 5 } = {}) {
    if (!post.author) return [];

    const docs = await Post.find({
      _id: { $ne: post._id },
      status: 'published',
      author: post.author._id || post.author,
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return docs;
  }
}
