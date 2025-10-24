/**
 * HighlightDecorator.js - Concrete Decorator
 * Thêm syntax highlighting cho code blocks
 */

import hljs from 'highlight.js';
import BaseProcessor from './BaseProcessor.js';

class HighlightDecorator extends BaseProcessor {
  constructor(processor) {
    super();
    this.processor = processor;
  }

  async process(post) {
    const processedPost = await this.processor.process(post);

    if (!processedPost.contentHTML) {
      return processedPost;
    }

    // Regex để tìm code blocks: <pre><code class="language-xxx">...</code></pre>
    const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;

    processedPost.contentHTML = processedPost.contentHTML.replace(
      codeBlockRegex,
      (match, lang, code) => {
        try {
          // Decode HTML entities trước khi highlight
          const decodedCode = this.decodeHtmlEntities(code);
          
          // Highlight code
          const highlighted = hljs.highlight(decodedCode, {
            language: lang,
            ignoreIllegals: true,
          });

          return `<pre><code class="hljs language-${lang}">${highlighted.value}</code></pre>`;
        } catch (error) {
          // Nếu không hỗ trợ ngôn ngữ, trả về code gốc
          return `<pre><code class="language-${lang}">${code}</code></pre>`;
        }
      }
    );

    // Xử lý inline code (không có language)
    const inlineCodeRegex = /<code>([^<]+)<\/code>/g;
    processedPost.contentHTML = processedPost.contentHTML.replace(
      inlineCodeRegex,
      '<code class="inline-code">$1</code>'
    );

    return processedPost;
  }

  decodeHtmlEntities(text) {
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
    };
    return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
  }
}

export default HighlightDecorator;
