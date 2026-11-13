import React, { useEffect, useState } from 'react';
import { postAPI } from '../services/api';
import BlogCard from './BlogCard';

export default function RelatedArticles({ currentPostId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentPostId) return;

    let isMounted = true;
    postAPI
      .getRelated(currentPostId)
      .then((res) => {
        if (isMounted && res.data.success) {
          setPosts(res.data.posts);
        }
      })
      .catch((err) => console.warn('Could not fetch related articles:', err.message))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPostId]);

  if (loading || posts.length === 0) return null;

  return (
    <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-light)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="section-label">Related Reading</span>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Explore Related Technical Analyses</h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}
      >
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
