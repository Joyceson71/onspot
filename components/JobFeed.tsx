'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import CategoryTabs from './CategoryTabs';
import FilterChips from './FilterChips';
import JobCard from './JobCard';

export default function JobFeed() {
  const {
    userRole,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredJobs,
    openModal,
    resetFilters,
    advancedFilters,
  } = useApp();

  const activeFiltersCount =
    (advancedFilters.categories.length > 0 ? 1 : 0) +
    (advancedFilters.dateFilter ? 1 : 0) +
    (advancedFilters.duration ? 1 : 0) +
    (advancedFilters.gender && advancedFilters.gender !== 'any' ? 1 : 0) +
    (advancedFilters.location ? 1 : 0);

  return (
    <div id="home-section">
      {/* Search & Filters Container */}
      <div className="search-filter-section">
        {/* Live Instant Search Bar + Filter Button */}
        <div className="search-row">
          <div className="search-input-container">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shifts by title, venue (e.g. Adyar, Guindy), catering, brand promotion..."
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                id="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          <button
            className="btn-filter"
            id="btn-open-filter"
            onClick={() => openModal('filter-modal')}
            title="Filter shifts"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="filter-label-text">Filter</span>
            <span className="filter-count-badge" id="filter-count-badge">
              {activeFiltersCount}
            </span>
          </button>
        </div>

        {/* Horizontal Category Tabs */}
        <CategoryTabs />

        {/* Smart Filter Chips */}
        <FilterChips />
      </div>

      {/* Section Title & Sort Bar */}
      <div className="section-meta-bar">
        <div className="section-title">
          <span id="section-title-text">
            {userRole === 'seeker'
              ? 'Available Shift Openings'
              : 'Your Published Requirements'}
          </span>
          <span className="count-indicator" id="listings-count-badge">
            {filteredJobs.length} Openings
          </span>
        </div>

        <div className="sort-select-wrapper">
          <span>Sort By:</span>
          <select
            className="sort-select"
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">Best Recommended</option>
            <option value="pay_desc">Highest Pay Rate</option>
            <option value="slots_open">Urgent Spots Open</option>
            <option value="rating">Top Rated Dealer</option>
          </select>
        </div>
      </div>

      {/* Shift Cards Grid */}
      <div className="shifts-grid" id="listings-container">
        {filteredJobs.length === 0 ? (
          <div
            style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '50px 20px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
            <h4
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}
            >
              No matching shifts found
            </h4>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                maxWidth: '360px',
                margin: '0 auto 16px auto',
              }}
            >
              Try clearing search keywords or active filter chips to discover more available gigs.
            </p>
            <button className="btn-action-primary" onClick={resetFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredJobs.map((item) => <JobCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
