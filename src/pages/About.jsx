
import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';

// Import local author profile images
import feeImage from '../components/Image/fee.jpg';
import r1Image from '../components/Image/r1.jpg';
import r2Image from '../components/Image/r2.jpg';
import r3Image from '../components/Image/r3.jpg';

import {
  ShieldCheck,
  Terminal,
  ArrowRight,
  Award
} from 'lucide-react';

export default function About() {

  // Editorial Board Members
  const editorialBoard = [
    {
      name: 'Feringston',
      role: 'VP of Distributed Systems Architecture',
      bio: 'Over 14 years building high-throughput stateful backends, distributed consensus clusters, and resilient event streaming pipelines.',
      image: feeImage
    },
    {
      name: 'Joyal',
      role: 'Principal Security Architect',
      bio: 'Leading cybersecurity research, zero-trust infrastructure, identity federation (SPIFFE/SPIRE), and Linux kernel security.',
      image: r1Image
    },
    {
      name: 'Jain',
      role: 'Head of Applied AI Research',
      bio: 'Focuses on scalable LLM fine-tuning, retrieval-augmented systems, artificial intelligence, and high-density inference.',
      image: r2Image
    },
    {
      name: 'Karutos',
      role: 'Staff Frontend & Platform Engineer',
      bio: 'Passionate about Web Performance, Core Web Vitals (INP/LCP), edge compute architectures, and developer productivity tooling.',
      image: r3Image
    }
  ];

  return (
    <div
      style={{
        paddingTop: '2.5rem',
        paddingBottom: '6rem'
      }}
    >
      <div className="container">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'About Us' }
          ]}
        />

        {/* About Heading */}
        <div
          style={{
            maxWidth: '820px',
            marginBottom: '4rem'
          }}
        >
          <span className="section-label">
            Editorial Mission
          </span>

          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: '1.25rem'
            }}
          >
            Practitioner-Led Engineering Insights for Modern Software Organizations
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}
          >
            TechNotes is a technology blog run by TechNotes.
            We publish technical tutorials, distributed systems
            architectural retrospectives, and deep dives into
            modern infrastructure.
          </p>
        </div>

        {/* Editorial Features */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >

          {/* Feature 1 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Terminal size={22} />
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.65rem'
              }}
            >
              Production-Verified Code
            </h3>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}
            >
              Every benchmark, architecture diagram, and code sample
              published here comes directly from real systems deployed
              in production environments.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <ShieldCheck size={22} />
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.65rem'
              }}
            >
              Zero Marketing Fluff
            </h3>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}
            >
              We respect our readers' time. We reject sponsored clickbait
              and superficial listicles in favor of granular engineering
              substance and honest trade-offs.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Award size={22} />
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.65rem'
              }}
            >
              Peer-Reviewed Rigor
            </h3>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}
            >
              Our editorial process mirrors rigorous peer review.
              Before release, articles undergo technical review by
              senior platform architects.
            </p>
          </div>

        </div>

        {/* Editorial Board Section */}
        <section style={{ marginBottom: '5rem' }}>

          <div className="section-header">

            <span className="section-label">
              The People Behind the Words
            </span>

            <h2 className="section-title">
              Editorial Board & Lead Authors
            </h2>

            <p className="section-description">
              Meet the senior engineers, researchers, and technical
              leaders who write and maintain our publication.
            </p>

          </div>

          {/* Author Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >

            {editorialBoard.map((member) => (

              <div
                key={member.name}
                className="card"
                style={{
                  padding: '2rem',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >

                {/* Profile Image */}
                <img
                  src={member.image}
                  alt={member.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://placehold.co/400x400?text=Author';
                  }}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1.25rem'
                  }}
                />

                {/* Author Name */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.25rem'
                  }}
                >
                  {member.name}
                </h3>

                {/* Author Designation */}
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    marginBottom: '1rem'
                  }}
                >
                  {member.role}
                </div>

                {/* Author Biography */}
                <p
                  style={{
                    fontSize: '0.925rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}
                >
                  {member.bio}
                </p>

              </div>

            ))}

          </div>
        </section>

        {/* Contribution Section */}
        <div
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >

          <h2
            style={{
              fontSize: '2rem',
              color: '#ffffff',
              marginBottom: '1rem'
            }}
          >
            Interested in Contributing or Proposing a Topic?
          </h2>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '1.1rem',
              maxWidth: '640px',
              margin: '0 auto 2rem'
            }}
          >
            We welcome guest submissions and collaborative research
            proposals from experienced engineering teams.
          </p>

          <Link
            to="/contact"
            className="btn btn-primary"
            style={{
              backgroundColor: 'var(--primary)'
            }}
          >
            <span>Submit Editorial Proposal</span>
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>
    </div>
  );
}
