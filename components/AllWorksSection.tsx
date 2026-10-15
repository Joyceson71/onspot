'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, CATEGORY_MEDIA, KNOWN_LOCALITIES } from '@/lib/initialData';
import JobCard from './JobCard';

// Category metadata with icons, descriptions, and salary cues
const CATEGORY_META: Record<
  string,
  {
    icon: string;
    tagline: string;
    typicalPay: string;
    perk: string;
  }
> = {
  Catering: {
    icon: '🍽️',
    tagline: 'Banquet service, plate service & dining hospitality',
    typicalPay: '₹800 – ₹1,000 / shift',
    perk: 'Buffet Meals & High Tea Included',
  },
  Promotions: {
    icon: '📢',
    tagline: 'Tech launches, brand activations & booth hosts',
    typicalPay: '₹1,000 – ₹1,500 / shift',
    perk: 'Instant UPI & Performance Bonus',
  },
  Pamphlet: {
    icon: '📄',
    tagline: 'Flyer distribution at metro stations & busy hubs',
    typicalPay: '₹500 – ₹700 / shift',
    perk: 'Short 3.5h Evening Shifts',
  },
  Ushering: {
    icon: '🎟️',
    tagline: 'VIP access control, concert gates & guest seating',
    typicalPay: '₹900 – ₹1,200 / shift',
    perk: 'Concert & Event Access Passes',
  },
  Setup: {
    icon: '🏗️',
    tagline: 'Truss assembly, audio racks & event logistics crew',
    typicalPay: '₹850 – ₹1,200 / shift',
    perk: 'Overtime Allowance (₹150/hr)',
  },
};

export default function AllWorksSection() {
  const { activeSection, selectCategory, openSection, shifts, dealerPosts, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterInstantPay, setFilterInstantPay] = useState(false);
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'pay_high' | 'slots_left'>('recommended');

  if (activeSection !== 'other') return null;

  const dataset = userRole === 'seeker' ? shifts : dealerPosts;

  // Platform high-level metrics
  const totalOpenings = dataset.length;
  const totalSlotsLeft = dataset.reduce(
    (acc, job) => acc + Math.max(0, (job.slotsTotal || 0) - (job.slotsFilled || 0)),
    0
  );
  const instantPayCount = dataset.filter((j) => j.instantPay).length;

  // Filtered categories for the category cards
  const categoryList = CATEGORIES.filter((c) => c.key !== 'All');

  // Filtered jobs for the live feed below
  const filteredJobs = useMemo(() => {
    return dataset.filter((job) => {
      // Category filter
      if (selectedCategory !== 'All' && job.category !== selectedCategory) {
        return false;
      }
      // Instant pay filter
      if (filterInstantPay && !job.instantPay) {
        return false;
      }
      // Urgent filter
      if (filterUrgent && !job.urgent) {
        return false;
      }
      // Locality filter
      if (selectedLocality && !job.loc.toLowerCase().includes(selectedLocality.toLowerCase())) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCategory = (job.categoryDisplay || job.category).toLowerCase().includes(query);
        const matchesLocation = job.loc.toLowerCase().includes(query);
        const matchesDealer = job.dealerName.toLowerCase().includes(query);
        const matchesDesc = (job.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesLocation && !matchesDealer && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'pay_high') {
        return (b.rawPay || 0) - (a.rawPay || 0);
      }
      if (sortBy === 'slots_left') {
        const slotsA = (a.slotsTotal || 0) - (a.slotsFilled || 0);
        const slotsB = (b.slotsTotal || 0) - (b.slotsFilled || 0);
        return slotsB - slotsA;
      }
      // Default: urgent first, then active
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return 0;
    });
  }, [dataset, selectedCategory, filterInstantPay, filterUrgent, selectedLocality, searchTerm, sortBy]);

  const handleCategoryCardClick = (catKey: string) => {
    if (selectedCategory === catKey) {
      setSelectedCategory('All');
    } else {
      setSelectedCategory(catKey);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setFilterInstantPay(false);
    setFilterUrgent(false);
    setSelectedLocality('');
    setSortBy('recommended');
  };

  return (
    <div
      id="other-section"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '28px 20px 80px 20px',
      }}
    >
      {/* ====================================================================
          1. HERO HEADER & OVERVIEW STATS
          ==================================================================== */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0, 245, 155, 0.08) 0%, rgba(14, 23, 19, 0.95) 100%)',
          border: '1px solid rgba(0, 245, 155, 0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px 28px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Subtle background glow circle */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 245, 155, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(0, 245, 155, 0.12)',
              border: '1px solid rgba(0, 245, 155, 0.3)',
              color: 'var(--mint-primary)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            <span>⚡ Work Directory</span>
            <span>•</span>
            <span>Chennai Region</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 34px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            Explore All Work Spheres
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              maxWidth: '680px',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            Discover verified banquet shifts, luxury catering, tech event promotions, VIP ushering, and stage logistics.
            Filter by sphere or jump directly into live available openings.
          </p>

          {/* Quick Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '14px',
            }}
          >
            <div
              style={{
                background: 'rgba(8, 15, 12, 0.75)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(0, 245, 155, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                💼
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {totalOpenings} Active
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Work Listings</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(8, 15, 12, 0.75)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                👥
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
                  {totalSlotsLeft} Slots
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Remaining To Fill</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(8, 15, 12, 0.75)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}>
                  {instantPayCount} Shifts
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instant UPI Payout</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(8, 15, 12, 0.75)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(0, 245, 155, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                💰
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--mint-primary)' }}>
                  ₹500 – ₹1,500
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Per Shift Range</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. FEATURED CATEGORIES DIRECTORY (VISUAL SHOWCASE CARDS)
          ==================================================================== */}
      <div style={{ marginBottom: '36px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              Work Categories
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Click any category card to filter live shifts below
            </p>
          </div>

          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                background: 'rgba(0, 245, 155, 0.1)',
                border: '1px solid var(--border-mint)',
                color: 'var(--mint-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>✕</span> Reset Category Filter ({selectedCategory})
            </button>
          )}
        </div>

        {/* Rich Category Cards Grid */}
        <div
          id="all-works-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {categoryList.map((cat) => {
            const count = dataset.filter((i) => i.category === cat.key).length;
            const slotsCount = dataset
              .filter((i) => i.category === cat.key)
              .reduce((acc, curr) => acc + Math.max(0, curr.slotsTotal - curr.slotsFilled), 0);
            const media = CATEGORY_MEDIA[cat.key as keyof typeof CATEGORY_MEDIA];
            const meta = CATEGORY_META[cat.key] || {
              icon: '💼',
              tagline: 'On-demand shift work',
              typicalPay: 'Competitive pay',
              perk: 'Direct Organizer Contact',
            };
            const isSelected = selectedCategory === cat.key;

            return (
              <div
                key={cat.key}
                onClick={() => handleCategoryCardClick(cat.key)}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                  border: isSelected
                    ? '2px solid var(--mint-primary)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected
                    ? '0 8px 28px rgba(0, 245, 155, 0.25), 0 0 16px rgba(0, 245, 155, 0.2)'
                    : 'var(--shadow-sm)',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(0, 245, 155, 0.35)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
              >
                {/* Image Banner */}
                <div
                  style={{
                    height: '110px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={media?.src || ''}
                    alt={cat.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.65)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(8,15,12,0.2) 0%, rgba(19,32,26,0.95) 100%)',
                    }}
                  />

                  {/* Icon & Openings Badge on Image */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '12px',
                      right: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '22px',
                        background: 'rgba(8, 15, 12, 0.7)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        padding: '4px 8px',
                      }}
                    >
                      {meta.icon}
                    </span>

                    <span
                      style={{
                        background: count > 0 ? 'rgba(0, 245, 155, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                        border: count > 0 ? '1px solid rgba(0, 245, 155, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                        color: count > 0 ? 'var(--mint-primary)' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {count > 0 && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'var(--mint-primary)',
                            display: 'inline-block',
                          }}
                        />
                      )}
                      {count} {count === 1 ? 'shift' : 'shifts'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '16px',
                      color: isSelected ? 'var(--mint-primary)' : 'var(--text-primary)',
                      marginBottom: '4px',
                    }}
                  >
                    {cat.label}
                  </div>

                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      marginBottom: '12px',
                      flex: 1,
                    }}
                  >
                    {meta.tagline}
                  </p>

                  <div
                    style={{
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: 'var(--text-muted)' }}>Typical Pay:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{meta.typicalPay}</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: '#38bdf8',
                        marginTop: '2px',
                      }}
                    >
                      <span>{slotsCount} open slots</span>
                      <span style={{ fontWeight: 600 }}>{isSelected ? 'Selected ✓' : 'Explore →'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          3. SMART SEARCH & FILTER CONTROLS BAR
          ==================================================================== */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '14px',
          }}
        >
          {/* Main Search Input */}
          <div
            className="search-input-container"
            style={{
              flex: '1 1 300px',
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-darkest)',
              border: '1px solid var(--border-subtle)',
              padding: '0 14px',
              borderRadius: 'var(--radius-md)',
              height: '44px',
              transition: 'border-color 0.2s ease',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--mint-primary)', marginRight: '10px', flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              id="all-works-search"
              placeholder="Search by title, venue (e.g. Guindy, Nandanam), banquet, agency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px',
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                background: 'var(--bg-darkest)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="recommended">Recommended & Urgent</option>
              <option value="pay_high">Highest Pay First</option>
              <option value="slots_left">Most Slots Available</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Filters:</span>

          {/* All Filter */}
          <button
            onClick={() => setSelectedCategory('All')}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedCategory === 'All' ? '1px solid var(--mint-primary)' : '1px solid var(--border-subtle)',
              background: selectedCategory === 'All' ? 'rgba(0, 245, 155, 0.15)' : 'var(--bg-darkest)',
              color: selectedCategory === 'All' ? 'var(--mint-primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            All Categories ({dataset.length})
          </button>

          {/* Category Chips */}
          {categoryList.map((cat) => {
            const isCatActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(isCatActive ? 'All' : cat.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isCatActive ? '1px solid var(--mint-primary)' : '1px solid var(--border-subtle)',
                  background: isCatActive ? 'rgba(0, 245, 155, 0.15)' : 'var(--bg-darkest)',
                  color: isCatActive ? 'var(--mint-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {CATEGORY_META[cat.key]?.icon || ''} {cat.label}
              </button>
            );
          })}

          <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 4px' }} />

          {/* Instant Pay Toggle */}
          <button
            onClick={() => setFilterInstantPay(!filterInstantPay)}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: filterInstantPay ? '1px solid #fbbf24' : '1px solid var(--border-subtle)',
              background: filterInstantPay ? 'rgba(251, 191, 36, 0.15)' : 'var(--bg-darkest)',
              color: filterInstantPay ? '#fbbf24' : 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>⚡ Instant UPI</span>
          </button>

          {/* Urgent Toggle */}
          <button
            onClick={() => setFilterUrgent(!filterUrgent)}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: filterUrgent ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
              background: filterUrgent ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-darkest)',
              color: filterUrgent ? '#f43f5e' : 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🔥 Urgent Shifts</span>
          </button>

          {(selectedCategory !== 'All' || filterInstantPay || filterUrgent || searchTerm || selectedLocality) && (
            <button
              onClick={handleResetFilters}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* ====================================================================
          4. LIVE SHIFTS LISTINGS FEED (MATCHING SELECTED FILTERS)
          ==================================================================== */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>
                {selectedCategory === 'All' ? 'All Live Shifts' : `${selectedCategory} Shifts`}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--mint-primary)',
                  background: 'rgba(0, 245, 155, 0.12)',
                  border: '1px solid rgba(0, 245, 155, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {filteredJobs.length} Available
              </span>
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Instant application with direct dealer settlement
            </p>
          </div>

          <button
            onClick={() => openSection('home')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Switch to Home Feed →</span>
          </button>
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}
            >
              🔍
            </div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              No shifts found for this selection
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px auto' }}>
              Try adjusting your search query, selecting another category, or resetting your active filters.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                background: 'var(--mint-primary)',
                color: 'var(--bg-darkest)',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                padding: '10px 22px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow-sm)',
              }}
            >
              View All Openings
            </button>
          </div>
        ) : (
          /* Live Job Cards Grid */
          <div className="shifts-grid" id="all-works-shifts-grid">
            {filteredJobs.map((item) => (
              <JobCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* ====================================================================
          5. CHENNAI LOCALITIES QUICK EXPLORER
          ==================================================================== */}
      <div
        style={{
          marginTop: '48px',
          padding: '24px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ marginBottom: '14px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
            📍 Popular Shift Localities in Chennai
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Filter shifts based on venue zones with high transit connectivity
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setSelectedLocality('')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedLocality === '' ? '1px solid var(--mint-primary)' : '1px solid var(--border-subtle)',
              background: selectedLocality === '' ? 'rgba(0, 245, 155, 0.15)' : 'var(--bg-darkest)',
              color: selectedLocality === '' ? 'var(--mint-primary)' : 'var(--text-secondary)',
            }}
          >
            All Chennai Zones
          </button>
          {KNOWN_LOCALITIES.map((loc) => {
            const isLocSelected = selectedLocality.toLowerCase() === loc.name.toLowerCase();
            return (
              <button
                key={loc.name}
                onClick={() => setSelectedLocality(isLocSelected ? '' : loc.name)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isLocSelected ? '1px solid var(--mint-primary)' : '1px solid var(--border-subtle)',
                  background: isLocSelected ? 'rgba(0, 245, 155, 0.15)' : 'var(--bg-darkest)',
                  color: isLocSelected ? 'var(--mint-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {loc.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          6. ONSPOT GUARANTEE & SHIFT PERKS
          ==================================================================== */}
      <div
        style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'rgba(14, 23, 19, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Instant UPI Settlements
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Direct UPI payout (GPay/PhonePe) directly to your account upon shift signoff. No weekly delays.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(14, 23, 19, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Verified Venues & Dealers
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            All event managers, five-star banquets, and brand coordinators are rated 4.6+ with verified credentials.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(14, 23, 19, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🍱</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Meals & Travel Perks
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Most shifts include complimentary dinner buffets, travel allowances, and branded merchandise.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(14, 23, 19, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎓</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Flexible Student Schedules
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Pick weekend or evening shifts that adapt to college lectures or personal availability.
          </p>
        </div>
      </div>
    </div>
  );
}
