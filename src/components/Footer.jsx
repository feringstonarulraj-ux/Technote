import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  FileText
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#000000',
        color: '#94a3b8',
        borderTop: '1px solid #1e293b',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}
        >
          <div style={{ gridColumn: 'span 1' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                textDecoration: 'none',
                marginBottom: '1.25rem'
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Layers size={18} strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em'
                }}
              >
                Tech<span style={{ color: '#ffffff' }}>Notes</span>
              </span>
            </Link>
            <p
              style={{
                fontSize: '0.925rem',
                lineHeight: 1.65,
                color: '#94a3b8',
                marginBottom: '1.5rem'
              }}
            >
              A tech blog by TechNotes. We share real-world architectures, cloud-native patterns, AI systems research, and software engineering practices from senior practitioners.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#cbd5e1',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  display: 'inline-flex'
                }}
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#cbd5e1',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  display: 'inline-flex'
                }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#cbd5e1',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  display: 'inline-flex'
                }}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4
              style={{
                color: '#f8fafc',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  Publication Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  All Articles Archive
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  About Our Editorial Board
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  Submit Technical Inquiries
                </Link>
              </li>
              <li>
                <Link to="/admin/login" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  Staff CMS Access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: '#f8fafc',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Technical Domains
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/category/software-development" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  Software Development
                </Link>
              </li>
              <li>
                <Link to="/category/artificial-intelligence" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  Artificial Intelligence & ML
                </Link>
              </li>
              <li>
                <Link to="/category/web-mobile-development" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  Web & Mobile Engineering
                </Link>
              </li>
              <li>
                <Link to="/category/cybersecurity" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  Cybersecurity & Zero Trust
                </Link>
              </li>
              <li>
                <Link to="/category/cloud-computing" style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
                  Cloud Architecture & DevOps
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: '#f8fafc',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
                <span>Poonamalle, Mangadu<br />Chennai, Tamil Nadu 600052</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={18} style={{ color: '#60a5fa', flexShrink: 0 }} />
                <span>feringston@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} style={{ color: '#60a5fa', flexShrink: 0 }} />
                <span>+91 7397019030</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#cbd5e1',
                    fontSize: '0.85rem'
                  }}
                >
                  <FileText size={14} />
                  {/* <span>XML Sitemap</span> */}
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem'
          }}
        >
          {/* <div>
            © {currentYear} TechNotes Systems, Inc. All rights reserved. Designed for technology leaders and engineers.
          </div> */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#94a3b8' }}>
              Privacy Policy
            </Link>
            <Link to="/about" style={{ color: '#94a3b8' }}>
              Terms of Publication
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
