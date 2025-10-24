/**
 * ByVelocityStrategy.js - Concrete Strategy
 * Xếp hạng bài viết theo velocity (views / tuổi bài tính theo giờ)
 */

class ByVelocityStrategy {
  /**
   * Xếp hạng posts theo velocity (views per hour)
   * @param {Array} posts - Mảng posts
   * @param {Number} limit - Số lượng posts trả về
   * @returns {Array} - Posts đã sắp xếp
   */
  rank(posts, limit = 10) {
    const now = new Date();

    // Tính velocity cho mỗi post
    const postsWithVelocity = posts.map(post => {
      const publishedDate = post.publishedAt || post.createdAt;
      const ageInHours = (now - new Date(publishedDate)) / (1000 * 60 * 60);
      
      // Tránh chia cho 0, tối thiểu 1 giờ
      const normalizedAge = Math.max(1, ageInHours);
      
      const velocity = (post.views || 0) / normalizedAge;

      return {
        ...post,
        _velocity: velocity,
      };
    });

    // Sắp xếp theo velocity giảm dần
    const sorted = postsWithVelocity.sort((a, b) => {
      return b._velocity - a._velocity;
    });

    return sorted.slice(0, limit);
  }
}

export default ByVelocityStrategy;
