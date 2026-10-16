'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export default function MVPShowcaseSection() {
  const { userRole, setUserRole, openModal, shifts, openSection } = useApp();

  const handleSeekerCTA = () => {
    openSection('home');
  };

  const handleDealerCTA = () => {
    setUserRole('dealer');
    openModal('post-work-modal');
  };

  return (
    <div className="mvp-page-container">
      {/* Hero Banner Section */}
      <section className="hero-mvp-banner">
        {/* Background ambient orbs */}
        <div className="hero-glow-orb hero-glow-1" />
        <div className="hero-glow-orb hero-glow-2" />
        <div className="hero-grid-mesh" />

        <div className="hero-content">
          {/* Top Live Badge */}
          <div className="hero-badge-pill">
            <span className="hero-pulse-dot" />
            <span className="hero-badge-title">ONSPOT MVP PLATFORM</span>
            <span className="hero-badge-sep">•</span>
            <span className="hero-badge-subtitle">Hyperlocal Chennai Gig Network</span>
          </div>

          {/* Hero Title */}
          <h1 className="hero-heading">
            Instant Gig Staffing. <br />
            <span className="hero-heading-gradient">Zero Hassle. Guaranteed Escrow.</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="hero-description">
            Experience the new standard for on-demand event staffing, catering support, and retail promotions.
            Workers secure transparent shifts with direct UPI payouts, while dealers hire verified talent in minutes.
          </p>

          {/* Action CTAs */}
          <div className="hero-cta-group">
            <button
              className="hero-btn-primary"
              onClick={handleSeekerCTA}
              id="mvp-explore-shifts-btn"
            >
              <span className="hero-btn-icon">⚡</span>
              <span>Launch Worker Feed</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <button
              className="hero-btn-secondary"
              onClick={handleDealerCTA}
              id="mvp-post-shift-btn"
            >
              <span className="hero-btn-icon">📢</span>
              <span>Post a Requirement</span>
            </button>
          </div>

          {/* Live Metrics Row */}
          <div className="hero-metrics-grid">
            <div className="hero-metric-card">
              <div className="hero-metric-num">
                <span>{shifts.length > 0 ? shifts.length : '12'}+</span>
              </div>
              <div className="hero-metric-label">Active Chennai Gigs</div>
            </div>

            <div className="hero-metric-card">
              <div className="hero-metric-num">
                <span>₹800+</span>
              </div>
              <div className="hero-metric-label">Avg. Payout / Shift</div>
            </div>

            <div className="hero-metric-card">
              <div className="hero-metric-num">
                <span>0%</span>
              </div>
              <div className="hero-metric-label">Worker Commission</div>
            </div>

            <div className="hero-metric-card">
              <div className="hero-metric-num">
                <span>Instant</span>
              </div>
              <div className="hero-metric-label">UPI Escrow Release</div>
            </div>
          </div>

          {/* Feature Highlights Pills */}
          <div className="hero-features-bar">
            <div className="hero-feature-item">
              <span className="hero-feature-icon">🛡️</span>
              <span>Escrow Protected Funds</span>
            </div>
            <div className="hero-feature-dot">•</div>
            <div className="hero-feature-item">
              <span className="hero-feature-icon">📍</span>
              <span>GPS Attendance & Verification</span>
            </div>
            <div className="hero-feature-dot">•</div>
            <div className="hero-feature-item">
              <span className="hero-feature-icon">💬</span>
              <span>Instant Dealer Chat</span>
            </div>
            <div className="hero-feature-dot">•</div>
            <div className="hero-feature-item">
              <span className="hero-feature-icon">⚡</span>
              <span>One-Tap Apply</span>
            </div>
          </div>
        </div>
      </section>

      {/* MVP Feature Showcase Grid */}
      <div className="mvp-showcase-grid">
        {/* Card 1 */}
        <div className="mvp-card">
          <div className="mvp-card-icon-box" style={{ background: 'var(--coral-subtle)', color: 'var(--coral)' }}>
            ⚡
          </div>
          <h3 className="mvp-card-title">Real-Time Shift Discovery</h3>
          <p className="mvp-card-desc">
            Browse live part-time openings filtered by date (Today/Tomorrow), location (Adyar, Guindy, Anna Nagar), and hourly rate.
          </p>
          <div className="mvp-card-tag">Dynamic Live Feed</div>
        </div>

        {/* Card 2 */}
        <div className="mvp-card">
          <div className="mvp-card-icon-box" style={{ background: 'var(--violet-subtle)', color: 'var(--violet)' }}>
            🛡️
          </div>
          <h3 className="mvp-card-title">Instant Escrow Settlement</h3>
          <p className="mvp-card-desc">
            Shift payments are secured upon posting and automatically released straight to the worker's registered UPI ID upon completion.
          </p>
          <div className="mvp-card-tag">Direct UPI Payout</div>
        </div>

        {/* Card 3 */}
        <div className="mvp-card">
          <div className="mvp-card-icon-box" style={{ background: 'var(--sky-subtle)', color: 'var(--sky)' }}>
            📍
          </div>
          <h3 className="mvp-card-title">Hyperlocal Location Intelligence</h3>
          <p className="mvp-card-desc">
            Find venue directions, distance indicators, and nearby metro station connectivity for every single shift listing.
          </p>
          <div className="mvp-card-tag">Chennai Centric</div>
        </div>

        {/* Card 4 */}
        <div className="mvp-card">
          <div className="mvp-card-icon-box" style={{ background: 'rgba(52, 211, 153, 0.12)', color: 'var(--success)' }}>
            👥
          </div>
          <h3 className="mvp-card-title">Seamless Dual Roles</h3>
          <p className="mvp-card-desc">
            Switch effortlessly between Seeker mode (finding gigs) and Dealer mode (publishing event staffing requirements with instant applicant management).
          </p>
          <div className="mvp-card-tag">Dual Persona</div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="mvp-bottom-cta">
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#fff', marginBottom: '6px' }}>
            Ready to test the live marketplace?
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Explore available shifts now or publish a new requirement in under 60 seconds.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="hero-btn-primary" onClick={handleSeekerCTA}>
            Go to Live Listings
          </button>
        </div>
      </div>
    </div>
  );
}
