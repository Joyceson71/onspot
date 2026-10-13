'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export default function FilterChips() {
  const { activeFilterChips, toggleFilterChip, setGenderFilter } = useApp();

  const isToday = activeFilterChips.has('today');
  const isHighPay = activeFilterChips.has('highpay');
  const isInstant = activeFilterChips.has('instant');
  const isUrgent = activeFilterChips.has('urgent');
  const isMeals = activeFilterChips.has('meals');
  const isBoys = activeFilterChips.has('boys');
  const isGirls = activeFilterChips.has('girls');
  const isAll = !isBoys && !isGirls;

  return (
    <div className="filter-chips-row no-scrollbar">
      <button
        className={`filter-chip ${isToday ? 'active' : ''}`}
        onClick={() => toggleFilterChip('today')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Today&apos;s Shifts
      </button>

      <button
        className={`filter-chip ${isHighPay ? 'active' : ''}`}
        onClick={() => toggleFilterChip('highpay')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
        High Pay (₹800+)
      </button>

      <button
        className={`filter-chip ${isInstant ? 'active' : ''}`}
        onClick={() => toggleFilterChip('instant')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Instant UPI Pay
      </button>

      <button
        className={`filter-chip ${isUrgent ? 'active' : ''}`}
        onClick={() => toggleFilterChip('urgent')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
        Urgent Openings
      </button>

      <button
        className={`filter-chip ${isMeals ? 'active' : ''}`}
        onClick={() => toggleFilterChip('meals')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" x2="6" y1="1" y2="4" />
          <line x1="10" x2="10" y1="1" y2="4" />
          <line x1="14" x2="14" y1="1" y2="4" />
        </svg>
        Meals Provided
      </button>

      <button
        className={`filter-chip ${isAll ? 'active' : ''}`}
        id="chip-gender-all"
        onClick={() => setGenderFilter('all')}
      >
        All Jobs
      </button>

      <button
        className={`filter-chip ${isBoys ? 'active' : ''}`}
        id="chip-gender-boys"
        onClick={() => setGenderFilter('boys')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Boys Only
      </button>

      <button
        className={`filter-chip ${isGirls ? 'active' : ''}`}
        id="chip-gender-girls"
        onClick={() => setGenderFilter('girls')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Girls Only
      </button>
    </div>
  );
}
