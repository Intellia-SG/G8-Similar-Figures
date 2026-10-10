// src/components/shared/Mascot.jsx
import React from 'react';
import './Mascot.css';

export default function Mascot({ mood = 'curious', message, size = 'md' }) {
  // Otto the Otter 🦦 (PRD §7: override with rationale)
  const emoji = mood === 'celebrate' ? '🦦' : mood === 'thinking' ? '🦦' : '🦦';

  return (
    <div className={`mascot-row-wrap mascot-${size}`}>
      <div className={`mascot-avatar-circle mood-${mood}`} title="Otto the Otter">
        <span className="mascot-avatar-emoji">{emoji}</span>
      </div>
      {message && (
        <div className="mascot-speech-bubble anim-fade-in">
          <span className="speech-text">{message}</span>
        </div>
      )}
    </div>
  );
}
