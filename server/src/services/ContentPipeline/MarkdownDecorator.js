/**
 * MarkdownDecorator.js - Concrete Decorator
 * Chuyển đổi Markdown sang HTML
 */

import { marked } from 'marked';
import BaseProcessor from './BaseProcessor.js';

class MarkdownDecorator extends BaseProcessor {
  constructor(processor) {
    super();
    this.processor = processor;
  }

  async process(post) {
    // Xử lý qua processor trước (nếu có)
    const processedPost = await this.processor.process(post);

    // Cấu hình marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Chuyển markdown sang HTML
    if (processedPost.contentMarkdown) {
      processedPost.contentHTML = marked.parse(processedPost.contentMarkdown);
    }

    return processedPost;
  }
}

export default MarkdownDecorator;
