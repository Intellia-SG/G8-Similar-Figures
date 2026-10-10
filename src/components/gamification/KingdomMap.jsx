// src/components/gamification/KingdomMap.jsx
import React from 'react';
import './KingdomMap.css';
import { DISTRICTS } from '../../data/questionBank.js';

export default function KingdomMap({ districtScores, districtCorrect, currentDistrict, onSelectDistrict }) {
  return (
    <div className="kingdom-grid">
      {DISTRICTS.map((dist, idx) => {
        const isCurrent = idx === currentDistrict;
        const isCompleted = districtScores?.[idx] !== null && districtScores?.[idx] !== undefined;
        const isUnlocked = idx <= currentDistrict || isCompleted;
        const correct = districtCorrect?.[idx] || 0;
        const qStart = idx * 10 + 1;
        const qEnd = (idx + 1) * 10;

        return (
          <div
            key={dist.id}
            className={`kingdom-district-card ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
            onClick={() => isUnlocked && onSelectDistrict && onSelectDistrict(idx)}
            role="button"
            tabIndex={isUnlocked ? 0 : -1}
          >
            {/* Header: W{idx+1} badge on left, Q{start}-{end} cyan label on right */}
            <div className="card-top-row">
              <span className="card-w-badge">W{idx + 1}</span>
              <span className="card-q-range">Q{qStart}–{qEnd}</span>
            </div>

            {/* Center Icon: Radar target if current, checkmark if completed, lock if locked */}
            <div className="card-center-icon">
              {isCurrent ? (
                <div className="radar-target-wrapper" aria-label="Active world">
                  <div className="radar-target-circle outer" />
                  <div className="radar-target-circle middle" />
                  <div className="radar-target-dot" />
                </div>
              ) : isCompleted ? (
                <div className="card-complete-badge">✅</div>
              ) : (
                <div className="card-locked-icon">🔒</div>
              )}
            </div>

            {/* World Name */}
            <div className="card-world-name" title={dist.name}>
              {dist.name}
            </div>

            {/* Status / CTA */}
            <div className="card-bottom-status">
              {isCurrent ? (
                <span className="cta-play">Play →</span>
              ) : isCompleted ? (
                <span className="status-score">{correct}/10 · Review</span>
              ) : (
                <span className="status-locked">Locked</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
