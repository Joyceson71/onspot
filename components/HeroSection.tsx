'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export default function HeroSection() {
  const { userRole, setUserRole, openModal, shifts, showToast } = useApp();

  const handleSeekerCTA = () => {
    const el = document.getElementById('search-input');
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  const handleDealerCTA = () => {
    setUserRole('dealer');
    openModal('post-work-modal');
  };

  return (
    <section className="hero-mvp-banner">
      {/* Background ambient orbs */}
      <div className="hero-glow-orb hero-glow-1" />
      <div className="hero-glow-orb hero-glow-2" />
      <div className="hero-grid-mesh" />

      <div className="hero-content">
        {/* Top Live Badge */}
        <div className="hero-badge-pill">
          <span className="hero-pulse-dot" />
          <span className="hero-badge-title">ONSPOT MVP LIVE</span>
          <span className="hero-badge-sep">•</span>
          <span className="hero-badge-subtitle">Direct On-Demand Gig Network</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-heading">
          Find Instant Part-Time Shifts. <br />
          <span className="hero-heading-gradient">Get Paid on the Spot.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-description">
          The next-generation gig platform built for immediate hiring across Chennai banquets,
          promotions, luxury catering, and event logistics. Transparent pay rates, instant verification,
          and guaranteed escrow settlement.
        </p>

        {/* Action CTAs */}
        <div className="hero-cta-group">
          <button
            className="hero-btn-primary"
            onClick={handleSeekerCTA}
            id="hero-explore-shifts-btn"
          >
            <span className="hero-btn-icon">⚡</span>
            <span>Explore Active Shifts</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          <button
            className="hero-btn-secondary"
            onClick={handleDealerCTA}
            id="hero-post-shift-btn"
          >
            <span className="hero-btn-icon">📢</span>
            <span>Post a Shift in 60s</span>
          </button>
        </div>

        {/* Live Metrics Row */}
        <div className="hero-metrics-grid">
          <div className="hero-metric-card">
            <div className="hero-metric-num">
              <span>{shifts.length > 0 ? shifts.length : '12'}+</span>
            </div>
            <div className="hero-metric-label">Verified Live Gigs</div>
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
            <div className="hero-metric-label">Seeker Commission</div>
          </div>

          <div className="hero-metric-card">
            <div className="hero-metric-num">
              <span>Instant</span>
            </div>
            <div className="hero-metric-label">Direct UPI Payout</div>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="hero-features-bar">
          <div className="hero-feature-item">
            <span className="hero-feature-icon">🛡️</span>
            <span>Escrow Payout Guarantee</span>
          </div>
          <div className="hero-feature-dot">•</div>
          <div className="hero-feature-item">
            <span className="hero-feature-icon">📍</span>
            <span>Hyperlocal Chennai Venues</span>
          </div>
          <div className="hero-feature-dot">•</div>
          <div className="hero-feature-item">
            <span className="hero-feature-icon">💬</span>
            <span>Real-time Dealer Chat</span>
          </div>
          <div className="hero-feature-dot">•</div>
          <div className="hero-feature-item">
            <span className="hero-feature-icon">⚡</span>
            <span>Zero Paperwork Sign-off</span>
          </div>
        </div>
      </div>
    </section>
  );
}
