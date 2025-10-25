/**
 * buildContent.js - Utility
 * Tạo chuỗi Decorator pipeline để xử lý nội dung
 */

import BaseProcessor from '../services/ContentPipeline/BaseProcessor.js';
import MarkdownDecorator from '../services/ContentPipeline/MarkdownDecorator.js';
import SanitizeDecorator from '../services/ContentPipeline/SanitizeDecorator.js';
import HighlightDecorator from '../services/ContentPipeline/HighlightDecorator.js';
import ReadingTimeDecorator from '../services/ContentPipeline/ReadingTimeDecorator.js';

/**
 * Tạo pipeline xử lý content theo thứ tự:
 * Base → Markdown → Sanitize → Highlight → ReadingTime
 * 
 * @returns {BaseProcessor} - Decorated processor
 */
export function buildContentPipeline() {
  let processor = new BaseProcessor();
  
  // Thứ tự decorators (từ trong ra ngoài)
  processor = new MarkdownDecorator(processor);
  processor = new SanitizeDecorator(processor);
  processor = new HighlightDecorator(processor);
  processor = new ReadingTimeDecorator(processor);

  return processor;
}

/**
 * Xử lý nội dung post qua pipeline
 * @param {Object} post - Post object với contentMarkdown
 * @returns {Object} - Processed post với contentHTML và readingTime
 */
export async function processPostContent(post) {
  const pipeline = buildContentPipeline();
  return await pipeline.process(post);
}

/**
 * Generate excerpt từ markdown content
 * @param {String} markdown - Markdown content
 * @param {Number} maxLength - Maximum length (default 200)
 * @returns {String} - Plain text excerpt
 */
export function generateExcerpt(markdown, maxLength = 200) {
  if (!markdown) return '';
  
  // Remove markdown syntax
  let text = markdown
    // Remove headers
    .replace(/#{1,6}\s+/g, '')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
  
  // Truncate to maxLength
  if (text.length > maxLength) {
    text = text.substring(0, maxLength);
    // Cut at last complete word
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > 0) {
      text = text.substring(0, lastSpace);
    }
    text += '...';
  }
  
  return text;
}
