'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/initialData';

export default function AllWorksSection() {
  const { activeSection, selectCategory, openSection, shifts, dealerPosts, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  if (activeSection !== 'other') return null;

  const dataset = userRole === 'seeker' ? shifts : dealerPosts;

  const filteredCategories = CATEGORIES.filter(
    (c) => c.key !== 'All' && c.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div id="other-section" style={{ padding: '20px' }}>
      <div className="section-title" style={{ marginBottom: '8px' }}>
        <span>All Works</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
        Explore all available work categories
      </p>

      <div
        className="search-input-container"
        style={{
          marginBottom: '24px',
          maxWidth: '400px',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-dark)',
          border: '1px solid var(--border-mint)',
          padding: '0 12px',
          borderRadius: 'var(--radius-md)',
          height: '42px',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'var(--mint-primary)', marginRight: '10px' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          id="all-works-search"
          placeholder="Search work..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            outline: 'none',
            flex: 1,
            fontSize: '14px',
          }}
        />
      </div>

      <div
        id="all-works-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
        }}
      >
        {filteredCategories.map((cat) => {
          const count = dataset.filter((i) => i.category === cat.key).length;
          return (
            <div
              key={cat.key}
              className="cat-tab"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 12px',
                textAlign: 'center',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
              onClick={() => {
                selectCategory(cat.key);
                openSection('home');
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>{cat.label}</div>
              <span className="cat-badge">{count} openings</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
