import Post from '../../models/Post.js';

/**
 * BySimilarityStrategy
 * Gợi ý dựa trên độ tương đồng nội dung đơn giản (tiêu đề + excerpt)
 */
export default class BySimilarityStrategy {
  async recommend(post, { limit = 5 } = {}) {
    const terms = [post.title, post.excerpt].filter(Boolean).join(' ');
    if (!terms) return [];

    // Text search dùng index { title: 'text' }
    const docs = await Post.find({
      _id: { $ne: post._id },
      status: 'published',
      $text: { $search: terms },
    }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();

    return docs;
  }
}
