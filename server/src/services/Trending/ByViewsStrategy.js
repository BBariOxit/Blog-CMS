/**
 * ByViewsStrategy.js - Concrete Strategy
 * Xếp hạng bài viết theo số lượt xem (views)
 */

class ByViewsStrategy {
  /**
   * Xếp hạng posts theo views giảm dần
   * @param {Array} posts - Mảng posts
   * @param {Number} limit - Số lượng posts trả về
   * @returns {Array} - Posts đã sắp xếp
   */
  rank(posts, limit = 10) {
    // Sắp xếp theo views giảm dần
    const sorted = [...posts].sort((a, b) => {
      return (b.views || 0) - (a.views || 0);
    });

    return sorted.slice(0, limit);
  }
}

export default ByViewsStrategy;
