'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import JobCard from './JobCard';

export default function SavedJobsSection() {
  const { shifts, dealerPosts, bookmarkedJobIds, openSection, activeSection } = useApp();

  if (activeSection !== 'saved') return null;

  const allJobs = [...shifts, ...dealerPosts];
  const savedJobs = allJobs.filter((j) => bookmarkedJobIds.has(j.id));

  return (
    <div id="saved-section" style={{ padding: '20px' }}>
      <div className="section-title" style={{ marginBottom: '20px' }}>
        <span>Saved Jobs</span>
      </div>

      {savedJobs.length === 0 ? (
        <div
          id="saved-jobs-empty"
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-subtle)',
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            style={{ marginBottom: '16px' }}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
            No saved jobs yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Save jobs you are interested in and find them here later.
          </p>
          <button className="btn-action-primary" onClick={() => openSection('home')}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="shifts-grid" id="saved-jobs-grid">
          {savedJobs.map((item) => (
            <JobCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
