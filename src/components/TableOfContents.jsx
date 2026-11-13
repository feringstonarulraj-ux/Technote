import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export default function TableOfContents({ contentHtml }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!contentHtml) return;

    // Wait for DOM rendering
    const timer = setTimeout(() => {
      const container = document.querySelector('.article-prose');
      if (!container) return;

      const elements = container.querySelectorAll('h2, h3');
      const items = [];

      elements.forEach((el, index) => {
        // Generate an ID if none exists
        if (!el.id) {
          const idText = el.textContent
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-');
          el.id = idText || `heading-${index}`;
        }

        items.push({
          id: el.id,
          text: el.textContent,
          level: el.tagName.toLowerCase()
        });
      });

      setHeadings(items);
    }, 150);

    return () => clearTimeout(timer);
  }, [contentHtml]);

  // Scroll spy to highlight active section
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-xs)'
      }}
      aria-label="Table of Contents"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.85rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.5rem'
        }}
      >
        <List size={16} style={{ color: 'var(--primary)' }} />
        <span>Table of Contents</span>
      </div>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              style={{
                paddingLeft: h.level === 'h3' ? '1rem' : '0'
              }}
            >
              <button
                type="button"
                onClick={() => scrollToHeading(h.id)}
                style={{
                  textAlign: 'left',
                  fontSize: h.level === 'h3' ? '0.825rem' : '0.875rem',
                  lineHeight: 1.4,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.15s ease',
                  borderLeft: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  paddingLeft: '0.5rem',
                  display: 'block',
                  width: '100%'
                }}
              >
                {h.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
