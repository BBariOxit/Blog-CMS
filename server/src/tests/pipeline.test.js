/**
 * pipeline.test.js
 * Test Decorator Pattern - Content Pipeline
 */

import { processPostContent } from '../utils/buildContent.js';

describe('Decorator Pattern - Content Pipeline', () => {
  test('should convert markdown to HTML', async () => {
    const post = {
      contentMarkdown: '# Hello World\n\nThis is **bold** text.',
    };

    const result = await processPostContent(post);

    expect(result.contentHTML).toContain('<h1');
    expect(result.contentHTML).toContain('Hello World');
    expect(result.contentHTML).toContain('<strong>');
    expect(result.contentHTML).toContain('bold');
  });

  test('should sanitize dangerous HTML', async () => {
    const post = {
      contentMarkdown: 'Safe content\n\n<script>alert("xss")</script>',
    };

    const result = await processPostContent(post);

    expect(result.contentHTML).not.toContain('<script>');
    expect(result.contentHTML).not.toContain('alert');
  });

  test('should highlight code blocks', async () => {
    const post = {
      contentMarkdown: '```javascript\nconst x = 10;\nconsole.log(x);\n```',
    };

    const result = await processPostContent(post);

    expect(result.contentHTML).toContain('hljs');
    expect(result.contentHTML).toContain('language-javascript');
  });

  test('should calculate reading time', async () => {
    const longText = new Array(250).fill('word').join(' ');
    const post = {
      contentMarkdown: longText,
    };

    const result = await processPostContent(post);

    expect(result.readingTime).toBeGreaterThan(0);
    expect(result.readingTime).toBe(2); // 250 words / 200 wpm ≈ 2 minutes
  });

  test('should have minimum 1 minute reading time', async () => {
    const post = {
      contentMarkdown: 'Short text',
    };

    const result = await processPostContent(post);

    expect(result.readingTime).toBe(1);
  });
});
