'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function LandingPage() {
  const { openSection, setUserRole, openModal, shifts } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleLaunchApp = (role: 'seeker' | 'dealer' = 'seeker') => {
    setUserRole(role);
    openSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPostShift = () => {
    setUserRole('dealer');
    openModal('post-work-modal');
  };

  const faqs = [
    {
      q: 'How does OnSpot guarantee instant worker payouts?',
      a: 'When an employer or banquet dealer publishes a shift requirement, the compensation amount is committed into OnSpot Escrow. As soon as the shift manager signs off attendance and task completion, funds are disbursed directly to the worker\'s verified UPI ID in under 60 seconds.'
    },
    {
      q: 'Do job seekers or gig workers have to pay any platform fee?',
      a: 'No! OnSpot is 100% free for workers and job seekers. What you see on the shift card (e.g. ₹850/shift) is 100% what lands in your bank account with zero commissions deducted.'
    },
    {
      q: 'What types of shifts are available on OnSpot?',
      a: 'OnSpot connects talent with premium banquet catering, wedding & event logistics, luxury hotel stewarding, mall brand promotions, registration desk crews, and retail weekend activations across Chennai zones (Adyar, Guindy, T. Nagar, Anna Nagar, OMR, etc.).'
    },
    {
      q: 'How fast can a business or banquet manager hire staff?',
      a: 'Dealers typically fill urgent requirements within 15 to 45 minutes. Our notification broadcast matches verified, available candidates living within a 5-10 km radius of the venue immediately.'
    },
    {
      q: 'What happens if a worker cancels or does not arrive?',
      a: 'Our smart standby pool automatically notifies backup talent near the venue. Furthermore, dealers can review worker ratings, punctuality scores, and past shift reviews before confirming applicants.'
    }
  ];

  return (
    <div className="landing-container">
      {/* 1. HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-hero-backdrop" />
        <div className="landing-hero-grid" />
        <div className="landing-glow-orb orb-left" />
        <div className="landing-glow-orb orb-right" />

        <div className="landing-hero-content">
          <div className="landing-hero-pill">
            <span className="landing-live-dot" />
            <span className="landing-pill-text">Chennai's First Direct Gig Staffing Exchange</span>
            <span className="landing-pill-badge">PRO MVP</span>
          </div>

          <h1 className="landing-title">
            The Instant Shift Economy <br />
            <span className="landing-title-grad">Built for Speed & Trust</span>
          </h1>

          <p className="landing-subtitle">
            Connecting banquet dealers, event managers, and retail stores with pre-verified
            part-time talent across Chennai. Escrow-backed payments, 1-click hiring, and zero worker commissions.
          </p>

          <div className="landing-hero-actions">
            <button
              className="landing-btn-hero-primary"
              onClick={() => handleLaunchApp('seeker')}
              id="landing-cta-find-shifts"
            >
              <span>Explore Live Shifts</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <button
              className="landing-btn-hero-secondary"
              onClick={handleOpenPostShift}
              id="landing-cta-post-shift"
            >
              <span>Hire Event Staff</span>
              <span className="landing-btn-sub">Post in 60s</span>
            </button>
          </div>

          {/* Social Proof Metric Counters */}
          <div className="landing-hero-stats">
            <div className="landing-stat-item">
              <div className="landing-stat-num">{shifts.length > 0 ? shifts.length : '18'}+</div>
              <div className="landing-stat-label">Active Shifts Today</div>
            </div>
            <div className="landing-stat-div" />
            <div className="landing-stat-item">
              <div className="landing-stat-num">₹850</div>
              <div className="landing-stat-label">Avg. Day Pay Rate</div>
            </div>
            <div className="landing-stat-div" />
            <div className="landing-stat-item">
              <div className="landing-stat-num">&lt; 60s</div>
              <div className="landing-stat-label">Instant UPI Escrow</div>
            </div>
            <div className="landing-stat-div" />
            <div className="landing-stat-item">
              <div className="landing-stat-num">4.9 ★</div>
              <div className="landing-stat-label">Dealer Trust Index</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE SHIFT TICKER / PREVIEW */}
      <section className="landing-ticker-section">
        <div className="landing-ticker-title">
          <span>🔥 POPULAR SHIFT ROLES CURRENTLY HIRING IN CHENNAI</span>
        </div>
        <div className="landing-ticker-row">
          <div className="landing-ticker-chip">🍽️ Banquet Catering Service • ₹800/shift</div>
          <div className="landing-ticker-chip">🛍️ Weekend Brand Promoter • ₹1,200/shift</div>
          <div className="landing-ticker-chip">☕ Barista & Beverage Counter • ₹900/shift</div>
          <div className="landing-ticker-chip">🎟️ Registration & VIP Usher • ₹1,000/shift</div>
          <div className="landing-ticker-chip">📦 Event Logistics Crew • ₹750/shift</div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (DUAL PERSPECTIVE) */}
      <section className="landing-section">
        <div className="landing-section-header">
          <div className="landing-badge">SIMPLE 3-STEP WORKFLOW</div>
          <h2 className="landing-heading">How OnSpot Works</h2>
          <p className="landing-subheading">
            Engineered from scratch to eliminate middlemen, delayed contractor payments, and last-minute worker no-shows.
          </p>
        </div>

        <div className="landing-steps-grid">
          {/* Step 1 */}
          <div className="landing-step-card">
            <div className="landing-step-num">01</div>
            <div className="landing-step-icon">🎯</div>
            <h3 className="landing-step-title">Instant Matching</h3>
            <p className="landing-step-desc">
              Browse shifts by locality, date, dress code, and exact pay. Filter for instant bookings or same-day openings.
            </p>
            <div className="landing-step-footer">Search by Chennai Zone</div>
          </div>

          {/* Step 2 */}
          <div className="landing-step-card active">
            <div className="landing-step-num">02</div>
            <div className="landing-step-icon">📍</div>
            <h3 className="landing-step-title">GPS Check-in & Sign-off</h3>
            <p className="landing-step-desc">
              Arrive at the venue, verify attendance with location tracking, perform the shift, and get manager sign-off on the spot.
            </p>
            <div className="landing-step-footer">Shield Verified Security</div>
          </div>

          {/* Step 3 */}
          <div className="landing-step-card">
            <div className="landing-step-num">03</div>
            <div className="landing-step-icon">⚡</div>
            <h3 className="landing-step-title">Escrow UPI Payout</h3>
            <p className="landing-step-desc">
              Shift manager confirms completion and escrow releases pay directly to your GooglePay, PhonePe, or Paytm UPI ID instantly.
            </p>
            <div className="landing-step-footer">0% Commission Surcharge</div>
          </div>
        </div>
      </section>

      {/* 4. KEY VALUE PROPOSITIONS & PLATFORM PILLARS */}
      <section className="landing-section landing-pillars-bg">
        <div className="landing-section-header">
          <div className="landing-badge">WHY CHOOSE ONSPOT</div>
          <h2 className="landing-heading">Why Leading Venues & Workers Trust Us</h2>
          <p className="landing-subheading">
            Modern infrastructure for gig staffing that protects both employers and workers.
          </p>
        </div>

        <div className="landing-features-grid">
          <div className="landing-feature-box">
            <div className="landing-feat-icon" style={{ background: 'var(--coral-subtle)', color: 'var(--coral)' }}>
              🛡️
            </div>
            <h4>Guaranteed Escrow Protection</h4>
            <p>
              Workers never have to chase payments or worry about wage defaults. Employer funds are locked upfront before shifts go live.
            </p>
          </div>

          <div className="landing-feature-box">
            <div className="landing-feat-icon" style={{ background: 'var(--violet-subtle)', color: 'var(--violet)' }}>
              💬
            </div>
            <h4>Direct Venue In-App Chat</h4>
            <p>
              Coordinate uniforms, entry gates, shift timings, and reporting instructions directly with shift coordinators in real-time.
            </p>
          </div>

          <div className="landing-feature-box">
            <div className="landing-feat-icon" style={{ background: 'var(--sky-subtle)', color: 'var(--sky)' }}>
              📍
            </div>
            <h4>Chennai Hyperlocal Coverage</h4>
            <p>
              Tailored specifically for major Chennai zones including T. Nagar, Guindy, ECR, OMR, Adyar, Koyambedu, and Anna Nagar.
            </p>
          </div>

          <div className="landing-feature-box">
            <div className="landing-feat-icon" style={{ background: 'rgba(52, 211, 153, 0.12)', color: 'var(--success)' }}>
              ⚡
            </div>
            <h4>Emergency Standby Staffing</h4>
            <p>
              Last-minute cancellations? Our dynamic broadcast system automatically deploys standby workers located within 5 km.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON TABLE: Traditional Contractors vs OnSpot */}
      <section className="landing-section">
        <div className="landing-section-header">
          <div className="landing-badge">THE ADVANTAGE</div>
          <h2 className="landing-heading">Traditional Agents vs. OnSpot</h2>
          <p className="landing-subheading">
            See how OnSpot transforms the event staffing landscape.
          </p>
        </div>

        <div className="landing-comparison-card">
          <div className="landing-comp-table">
            <div className="landing-comp-row header">
              <div className="landing-comp-col feature">Feature Comparison</div>
              <div className="landing-comp-col old">Old Contracting Agencies</div>
              <div className="landing-comp-col modern">OnSpot Platform</div>
            </div>

            <div className="landing-comp-row">
              <div className="landing-comp-col feature">Worker Payout Timing</div>
              <div className="landing-comp-col old">15 – 30 Days Delayed</div>
              <div className="landing-comp-col modern">⚡ Instant UPI (Under 60s)</div>
            </div>

            <div className="landing-comp-row">
              <div className="landing-comp-col feature">Worker Commission Cuts</div>
              <div className="landing-comp-col old">25% – 40% deducted</div>
              <div className="landing-comp-col modern">🎯 0% (Workers keep 100%)</div>
            </div>

            <div className="landing-comp-row">
              <div className="landing-comp-col feature">Time to Fill Shifts</div>
              <div className="landing-comp-col old">24 – 48 Hours via phone calls</div>
              <div className="landing-comp-col modern">⚡ 15 – 45 Minutes on-demand</div>
            </div>

            <div className="landing-comp-row">
              <div className="landing-comp-col feature">Transparency & Ratings</div>
              <div className="landing-comp-col old">Zero accountability or proof</div>
              <div className="landing-comp-col modern">⭐ Two-way ratings & verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="landing-section">
        <div className="landing-section-header">
          <div className="landing-badge">FREQUENTLY ASKED QUESTIONS</div>
          <h2 className="landing-heading">Everything You Need to Know</h2>
          <p className="landing-subheading">
            Have questions about how shifts, escrow, and payouts work? Find answers here.
          </p>
        </div>

        <div className="landing-faq-container">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className={`landing-faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="landing-faq-question">
                  <span>{faq.q}</span>
                  <span className="landing-faq-toggle">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className="landing-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section className="landing-bottom-banner">
        <div className="landing-bottom-content">
          <h2 className="landing-bottom-title">
            Ready to Experience On-Demand Shift Staffing?
          </h2>
          <p className="landing-bottom-desc">
            Join hundreds of workers and event managers across Chennai making gigs simple, safe, and instant.
          </p>
          <div className="landing-bottom-btns">
            <button
              className="landing-btn-hero-primary"
              onClick={() => handleLaunchApp('seeker')}
            >
              Start Finding Shifts Now
            </button>
            <button
              className="landing-btn-hero-secondary"
              onClick={handleOpenPostShift}
            >
              Post a Requirement
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="brand-title" style={{ fontSize: '18px' }}>
              ONSPOT <span className="brand-badge">PRO</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Instant part-time & gig staffing platform. Built for Chennai.
            </p>
          </div>
          <div className="landing-footer-links">
            <button onClick={() => handleLaunchApp('seeker')}>Live Feed</button>
            <button onClick={() => openSection('other')}>All Works</button>
            <button onClick={() => openModal('legal-modal')}>Terms of Service</button>
            <button onClick={() => openModal('support-modal')}>24/7 Support</button>
          </div>
        </div>
        <div className="landing-footer-copy">
          © {new Date().getFullYear()} OnSpot Technologies Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
