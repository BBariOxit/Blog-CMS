/**
 * BaseProcessor.js - Component interface cho Decorator Pattern
 * Định nghĩa interface cơ bản cho xử lý nội dung bài viết
 */

class BaseProcessor {
  /**
   * Process post content
   * @param {Object} post - Post object với contentMarkdown
   * @returns {Object} - Processed post object
   */
  async process(post) {
    return post;
  }
}

export default BaseProcessor;
