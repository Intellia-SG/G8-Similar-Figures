// src/components/shared/FloatingNumbers.jsx
import React from 'react';
import './FloatingNumbers.css';

const SYMBOLS = [
  '△', '≅', '∠', '∥', '⟂',
  'SSS', 'SAS', 'ASA', 'AAS', 'RHS',
  '🎭', '📐', 'A↔P', 'B↔Q', 'C↔R',
  '△ABC', '△PQR', '✓', '⭐', '🎬'
];

export default function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {SYMBOLS.map((sym, i) => (
        <span
          key={i}
          className="floating-number"
          style={{
            left: `${(i * 5.2 + 2) % 94}%`,
            top: `${(i * 7.1 + 5) % 88}%`,
            animationDelay: `${(i * 1.3) % 18}s`,
            animationDuration: `${20 + (i % 5) * 4}s`,
            fontSize: `${1.4 + (i % 3) * 0.45}rem`,
            opacity: 0.05 + (i % 3) * 0.02,
          }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
}
