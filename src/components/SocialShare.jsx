import React, { useState } from 'react';
import {
  Linkedin,
  Twitter,
  Facebook,
  Share2,
  Copy,
  Check,
  Send
} from 'lucide-react';

export default function SocialShare({ title, slug }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  const shareLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: Send,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${currentUrl}`)}`
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.65rem'
      }}
    >
      <span
        style={{
          fontSize: '0.825rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginRight: '0.25rem'
        }}
      >
        Share:
      </span>

      {shareLinks.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${item.name}`}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-subtle)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.borderColor = 'var(--primary-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
          >
            <Icon size={15} />
          </a>
        );
      })}

      <button
        type="button"
        onClick={handleCopyLink}
        title="Copy article link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: copied ? 'var(--status-success-bg)' : 'var(--bg-subtle)',
          border: `1px solid ${copied ? '#a6f4c5' : 'var(--border-light)'}`,
          color: copied ? 'var(--status-success)' : 'var(--text-secondary)',
          fontSize: '0.8rem',
          fontWeight: 600,
          transition: 'all 0.15s ease'
        }}
      >
        {copied ? (
          <>
            <Check size={14} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
