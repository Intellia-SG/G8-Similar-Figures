// src/components/simulations/TheScaleLab.jsx
import React, { useState } from 'react';
import './Stations.css';

const SCALE_VALUES = [0.5, 1, 1.5, 2, 2.5, 3];

export default function TheScaleLab({ onComplete, audioEnabled = true }) {
  const [scaleIdx, setScaleIdx] = useState(1); // default k = 1
  const [breakIt, setBreakIt] = useState(false);
  const [visitedEnlargement, setVisitedEnlargement] = useState(false);
  const [visitedReduction, setVisitedReduction] = useState(false);
  const [visitedBreak, setVisitedBreak] = useState(false);
  const [confirmAnswer, setConfirmAnswer] = useState(null);

  const k = SCALE_VALUES[scaleIdx];
  const baseW = 6;
  const baseH = 4;
  const basePerim = 2 * (baseW + baseH); // 20
  const baseArea = baseW * baseH; // 24

  // If breakIt is true, stretch width by k but keep height at 1
  const currentW = Math.round(baseW * k * 10) / 10;
  const currentH = breakIt ? baseH : Math.round(baseH * k * 10) / 10;
  const currentPerim = Math.round(2 * (currentW + currentH) * 10) / 10;
  const currentArea = Math.round(currentW * currentH * 10) / 10;
  const isSimilar = !breakIt && k !== 0;

  function handleScaleChange(newIdx) {
    if (newIdx < 0 || newIdx >= SCALE_VALUES.length) return;
    setScaleIdx(newIdx);
    const val = SCALE_VALUES[newIdx];
    if (val > 1) setVisitedEnlargement(true);
    if (val < 1) setVisitedReduction(true);
  }

  function handleBreakToggle() {
    const next = !breakIt;
    setBreakIt(next);
    if (next) setVisitedBreak(true);
  }

  const explorationDone = visitedEnlargement && visitedReduction && visitedBreak;
  const isComplete = explorationDone && confirmAnswer === 1;

  return (
    <div className="station-container">
      <div className="station-header">
        <div className="station-title-row">
          <span className="station-badge">Station A · Concept Discovery Lab</span>
          <h2 className="station-title">The Scale Lab 🔬</h2>
        </div>
        <p className="station-instruction">
          Drag the scale slider to see lengths scale by <strong style={{ color: '#F9C74F' }}>k</strong> and area by <strong style={{ color: '#F3722C' }}>k²</strong>. Then toggle "Break It" to see how non-uniform stretching destroys similarity!
        </p>
      </div>

      <div className="station-workspace">
        <div className="station-grid-2col">
          {/* Left Column: Visual Canvas */}
          <div className="station-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              background: 'rgba(10, 15, 35, 0.85)',
              border: `2px solid ${isSimilar ? '#4D908E' : '#ef5350'}`,
              borderRadius: '16px',
              width: '100%',
              height: '240px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Status Banner */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '12px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: isSimilar ? 'rgba(77,144,142,0.3)' : 'rgba(239,83,80,0.3)',
                color: isSimilar ? '#4D908E' : '#ef5350',
                fontWeight: 800,
                fontSize: '0.82rem',
                border: `1px solid ${isSimilar ? '#4D908E' : '#ef5350'}`,
              }}>
                {isSimilar ? `✓ SIMILAR (Scale Factor k = ${k})` : '❌ NOT SIMILAR (Angles Changed / Side Ratios Unequal)'}
              </div>

              {/* Dynamic Figure SVG */}
              <svg viewBox="0 0 260 160" style={{ width: '90%', height: '170px' }}>
                <rect
                  x={130 - (currentW * 12) / 2}
                  y={85 - (currentH * 12) / 2}
                  width={currentW * 12}
                  height={currentH * 12}
                  fill={isSimilar ? 'rgba(77,144,142,0.3)' : 'rgba(239,83,80,0.25)'}
                  stroke={isSimilar ? '#4D908E' : '#ef5350'}
                  strokeWidth="2.5"
                  rx="4"
                />
                {/* Labels */}
                <text x="130" y={75 - (currentH * 12) / 2} fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">
                  Width: {currentW} cm
                </text>
                <text x={140 + (currentW * 12) / 2} y="90" fill="#fff" fontSize="10" fontWeight="700" textAnchor="start">
                  Height: {currentH} cm
                </text>
                <text x="130" y="90" fill="var(--gold)" fontSize="11" fontWeight="800" textAnchor="middle">
                  Area: {currentArea} cm²
                </text>
              </svg>

              <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                {breakIt ? '⚠️ Stretched horizontally only: angles & proportions distorted!' : '✨ Uniform scaling: angles stay exactly 90°, all sides scale by k'}
              </div>
            </div>
          </div>

          {/* Right Column: Controls & Real-time Readouts */}
          <div className="station-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Slider Controls */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, color: 'var(--gold)' }}>Scale Factor k:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{k}×</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleScaleChange(scaleIdx - 1)}
                  disabled={scaleIdx === 0}
                  aria-label="Decrease scale factor"
                >
                  −
                </button>
                <input
                  type="range"
                  min="0"
                  max={SCALE_VALUES.length - 1}
                  step="1"
                  value={scaleIdx}
                  onChange={(e) => handleScaleChange(parseInt(e.target.value, 10))}
                  style={{ flex: 1, accentColor: 'var(--gold)' }}
                  aria-label="Scale factor slider"
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleScaleChange(scaleIdx + 1)}
                  disabled={scaleIdx === SCALE_VALUES.length - 1}
                  aria-label="Increase scale factor"
                >
                  +
                </button>
              </div>

              {/* Break It Toggle Switch */}
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Stretch in one direction:
                </span>
                <button
                  type="button"
                  className={`btn btn-sm ${breakIt ? 'btn-primary' : 'btn-outline'}`}
                  style={{ background: breakIt ? '#ef5350' : 'transparent', borderColor: breakIt ? '#ef5350' : 'rgba(255,255,255,0.3)' }}
                  onClick={handleBreakToggle}
                >
                  {breakIt ? 'Break It Active! 💥' : 'Test "Break It" 🔨'}
                </button>
              </div>
            </div>

            {/* Live Readouts */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              textAlign: 'center',
            }}>
              <div style={{ background: 'rgba(77,144,142,0.15)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(77,144,142,0.3)' }}>
                <div style={{ fontSize: '0.7rem', color: '#4D908E' }}>LENGTH (k)</div>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>×{breakIt ? `${k} & 1` : k}</div>
              </div>
              <div style={{ background: 'rgba(249,199,79,0.15)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(249,199,79,0.3)' }}>
                <div style={{ fontSize: '0.7rem', color: '#F9C74F' }}>PERIMETER (k)</div>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>{currentPerim} cm</div>
              </div>
              <div style={{ background: 'rgba(243,114,44,0.15)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(243,114,44,0.3)' }}>
                <div style={{ fontSize: '0.7rem', color: '#F3722C' }}>AREA (k²)</div>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>×{breakIt ? (currentArea / baseArea).toFixed(1) : Math.round(k * k * 10) / 10} ({currentArea} cm²)</div>
              </div>
            </div>

            {/* Checklist of required exploration */}
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', display: 'flex', gap: '10px' }}>
              <span>{visitedEnlargement ? '✅ Enlargement' : '⬜ Test k > 1'}</span>
              <span>{visitedReduction ? '✅ Reduction' : '⬜ Test k < 1'}</span>
              <span>{visitedBreak ? '✅ Stretched' : '⬜ Test Break It'}</span>
            </div>

            {/* Confirmation Question */}
            {explorationDone && (
              <div style={{ background: 'rgba(255,193,7,0.1)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,193,7,0.3)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '6px' }}>
                  Confirmation Check: When lengths are doubled (k = 2), what happens to the area?
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { label: 'Doubles (×2)', idx: 0 },
                    { label: 'Quadruples (×4 = k²)', idx: 1 },
                    { label: 'Stays same', idx: 2 },
                  ].map((opt) => (
                    <button
                      key={opt.idx}
                      type="button"
                      className={`btn btn-sm ${confirmAnswer === opt.idx ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1, fontSize: '0.75rem', padding: '4px' }}
                      onClick={() => setConfirmAnswer(opt.idx)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion Gate Footer */}
        {isComplete && (
          <div style={{
            background: 'rgba(46, 125, 50, 0.3)',
            border: '1.5px solid #4caf50',
            borderRadius: '12px',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
          }}>
            <span style={{ fontWeight: 700, color: '#81c784', fontSize: '0.9rem' }}>
              🎉 Outstanding! You discovered that lengths scale by k while area scales by k²!
            </span>
            <button className="btn btn-primary btn-sm" onClick={onComplete}>
              Complete Station ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
