/**
 * ReadingTimeDecorator.js - Concrete Decorator
 * Tính toán thời gian đọc bài viết (200 words/minute)
 */

import BaseProcessor from './BaseProcessor.js';

class ReadingTimeDecorator extends BaseProcessor {
  constructor(processor, wordsPerMinute = 200) {
    super();
    this.processor = processor;
    this.wordsPerMinute = wordsPerMinute;
  }

  async process(post) {
    const processedPost = await this.processor.process(post);

    if (processedPost.contentMarkdown) {
      const wordCount = this.countWords(processedPost.contentMarkdown);
      const minutes = Math.ceil(wordCount / this.wordsPerMinute);
      
      // Tối thiểu 1 phút
      processedPost.readingTime = Math.max(1, minutes);
    }

    return processedPost;
  }

  countWords(text) {
    // Loại bỏ markdown syntax và đếm từ
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '') // Loại code blocks
      .replace(/`[^`]*`/g, '') // Loại inline code
      .replace(/#{1,6}\s/g, '') // Loại headers
      .replace(/[*_~`]/g, '') // Loại markdown formatting
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Loại links, giữ text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Loại images
      .trim();

    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }
}

export default ReadingTimeDecorator;
