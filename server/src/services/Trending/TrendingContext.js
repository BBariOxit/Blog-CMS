/**
 * TrendingContext.js - Context cho Strategy Pattern
 * Quản lý strategy để xếp hạng bài viết trending
 */

class TrendingContext {
  constructor(strategy = null) {
    this.strategy = strategy;
  }

  /**
   * Set strategy để tính trending
   * @param {Object} strategy - Strategy object có method rank()
   */
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  /**
   * Lấy danh sách trending posts
   * @param {Array} posts - Mảng posts cần xếp hạng
   * @param {Number} limit - Số lượng posts trả về (default 10)
   * @returns {Array} - Mảng posts đã được xếp hạng
   */
  getTrending(posts, limit = 10) {
    if (!this.strategy) {
      throw new Error('Strategy chưa được set');
    }

    return this.strategy.rank(posts, limit);
  }
}

export default TrendingContext;
