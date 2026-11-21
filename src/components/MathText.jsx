import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function renderMathSegment(text, keyPrefix) {
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('$$')) {
      parts.push({ type: 'display', value: raw.slice(2, -2).trim() });
    } else {
      parts.push({ type: 'inline', value: raw.slice(1, -1).trim() });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts.map((part, idx) => {
    if (part.type === 'text') {
      return <React.Fragment key={`${keyPrefix}-t-${idx}`}>{part.value}</React.Fragment>;
    }
    try {
      const html = katex.renderToString(part.value, {
        displayMode: part.type === 'display',
        throwOnError: false,
        strict: false,
      });
      if (part.type === 'display') {
        return (
          <span
            key={`${keyPrefix}-d-${idx}`}
            className="math-display-block"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
      return (
        <span
          key={`${keyPrefix}-i-${idx}`}
          className="math-inline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return <code key={`${keyPrefix}-c-${idx}`}>{part.value}</code>;
    }
  });
}

/**
 * Renders text containing **bold** markers and inline $...$ / display $$...$$ LaTeX via KaTeX.
 */
export default function MathText({ text = '', className = '' }) {
  const rendered = useMemo(() => {
    if (!text) return null;
    const boldRegex = /(\*\*[\s\S]+?\*\*)/g;
    const segments = text.split(boldRegex);

    return segments.map((seg, idx) => {
      if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4) {
        return <strong key={`b-${idx}`}>{renderMathSegment(seg.slice(2, -2), `b-${idx}`)}</strong>;
      }
      return <React.Fragment key={`p-${idx}`}>{renderMathSegment(seg, `p-${idx}`)}</React.Fragment>;
    });
  }, [text]);

  return <span className={`math-text ${className}`}>{rendered}</span>;
}
