/**
 * MarkdownPreview.jsx
 * Preview markdown content (client-side rendering for editor preview)
 */

import { marked } from 'marked';
import { useEffect } from 'react';
import hljs from 'highlight.js';

// Import highlight.js theme
import 'highlight.js/styles/github-dark.css';

export default function MarkdownPreview({ markdown, content }) {
  // Accept either `markdown` or legacy `content` prop
  const md = markdown ?? content ?? '';

  useEffect(() => {
    // Highlight code blocks after render
    try {
      document.querySelectorAll('pre code').forEach((block) => {
        try { hljs.highlightElement(block); } catch (e) { /* ignore */ }
      });
    } catch (e) {
      // Defensive: in rare cases document may be unavailable
      // swallow to avoid crashing the entire app
      // console.warn('Highlight failed', e);
    }
  }, [md]);

  const getHTML = () => {
    if (!md) return '';

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    try {
      return marked.parse(md);
    } catch (e) {
      // If marked parsing fails, return escaped text
      return md.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  };

  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:font-bold
        prose-h1:text-3xl prose-h1:mb-4
        prose-h2:text-2xl prose-h2:mb-3
        prose-h3:text-xl prose-h3:mb-2
        prose-p:mb-4 prose-p:leading-relaxed
        prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
        prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-gray-900 prose-pre:text-gray-100
        prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: getHTML() }}
    />
  );
}
