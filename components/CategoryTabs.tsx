'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/initialData';

export default function CategoryTabs() {
  const { userRole, shifts, dealerPosts, activeCategory, selectCategory } = useApp();

  const dataset = userRole === 'seeker' ? shifts : dealerPosts;

  return (
    <div className="category-tabs-wrapper no-scrollbar" id="category-tabs">
      {CATEGORIES.map((cat) => {
        const count =
          cat.key === 'All'
            ? dataset.length
            : dataset.filter((i) => i.category === cat.key).length;
        const isActive = activeCategory === cat.key;

        return (
          <div
            key={cat.key}
            className={`cat-tab ${isActive ? 'active' : ''}`}
            onClick={() => selectCategory(cat.key)}
          >
            <span>{cat.label}</span>
            <span className="cat-badge">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
