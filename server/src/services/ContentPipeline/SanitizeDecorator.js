/**
 * SanitizeDecorator.js - Concrete Decorator
 * Làm sạch HTML để bảo mật (XSS prevention)
 */

import sanitizeHtml from 'sanitize-html';
import BaseProcessor from './BaseProcessor.js';

class SanitizeDecorator extends BaseProcessor {
  constructor(processor) {
    super();
    this.processor = processor;
  }

  async process(post) {
    const processedPost = await this.processor.process(post);

    // Cấu hình sanitize - cho phép các thẻ an toàn
    const sanitizeOptions = {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'u', 'del', 'code',
        'pre', 'blockquote',
        'ul', 'ol', 'li',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span',
      ],
      allowedAttributes: {
        a: ['href', 'title', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        code: ['class'],
        pre: ['class'],
        div: ['class'],
        span: ['class'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedClasses: {
        code: ['language-*'],
        pre: ['*'],
        div: ['highlight', 'code-block'],
        span: ['hljs-*'],
      },
    };

    if (processedPost.contentHTML) {
      processedPost.contentHTML = sanitizeHtml(
        processedPost.contentHTML,
        sanitizeOptions
      );
    }

    return processedPost;
  }
}

export default SanitizeDecorator;
