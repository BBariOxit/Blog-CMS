/**
 * ByWeightedEngagementStrategy.js - Concrete Strategy
 * Xếp hạng bài viết theo engagement score (views + 5*likes + 3*comments)
 */

class ByWeightedEngagementStrategy {
  constructor(config = {}) {
    // Trọng số mặc định
    this.weights = {
      views: config.viewWeight || 1,
      likes: config.likeWeight || 5,
      comments: config.commentWeight || 3,
    };
  }

  /**
   * Xếp hạng posts theo weighted engagement score
   * @param {Array} posts - Mảng posts
   * @param {Number} limit - Số lượng posts trả về
   * @returns {Array} - Posts đã sắp xếp
   */
  rank(posts, limit = 10) {
    // Tính score cho mỗi post
    const postsWithScore = posts.map(post => {
      const score = 
        (post.views || 0) * this.weights.views +
        (post.likes || 0) * this.weights.likes +
        (post.commentsCount || 0) * this.weights.comments;

      return {
        ...post,
        _engagementScore: score,
      };
    });

    // Sắp xếp theo score giảm dần
    const sorted = postsWithScore.sort((a, b) => {
      return b._engagementScore - a._engagementScore;
    });

    return sorted.slice(0, limit);
  }
}

export default ByWeightedEngagementStrategy;
