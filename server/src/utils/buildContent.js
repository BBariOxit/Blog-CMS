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
