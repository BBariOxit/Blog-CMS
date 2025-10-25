/**
 * RecommendationContext - Strategy Pattern
 * Chọn chiến lược gợi ý bài viết liên quan
 */

export default class RecommendationContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async getRecommendations(post, options = {}) {
    if (!this.strategy || typeof this.strategy.recommend !== 'function') {
      throw new Error('Invalid recommendation strategy');
    }
    return this.strategy.recommend(post, options);
  }
}
