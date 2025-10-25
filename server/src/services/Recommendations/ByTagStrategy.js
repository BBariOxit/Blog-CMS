import Post from '../../models/Post.js';

/**
 * ByTagStrategy
 * Gợi ý bài viết dựa trên tag trùng khớp với bài gốc
 */
export default class ByTagStrategy {
  async recommend(post, { limit = 5 } = {}) {
    const tags = post.tags || [];
    if (!tags.length) return [];

    const docs = await Post.find({
      _id: { $ne: post._id },
      status: 'published',
      tags: { $in: tags },
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return docs;
  }
}
