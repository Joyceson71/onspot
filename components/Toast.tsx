'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export default function Toast() {
  const { toastMessage } = useApp();

  return (
    <div
      className={`toast ${toastMessage ? 'show' : ''}`}
      id="toast"
      style={{ display: toastMessage ? 'block' : 'none' }}
    >
      {toastMessage}
    </div>
  );
}
