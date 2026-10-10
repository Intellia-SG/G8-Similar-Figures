// src/components/simulations/ScaleToFit.jsx
import React, { useState } from 'react';
import './Stations.css';

const EXHIBITS = [
  {
    id: 1,
    landmark: "The Clock Tower 🕰️",
    realHeight: 400, // cm
    realBaseArea: 2500, // cm²
    realVolume: 50000, // cm³
    constraintType: "Shelf Height Limit",
    limitDesc: "Must be no taller than 25 cm to fit on the exhibition display shelf",
    validTest: (k, h, a, v) => h <= 25,
    scales: [
      { label: "1/10", k: 0.1, desc: "Height = 40 cm" },
      { label: "1/20", k: 0.05, desc: "Height = 20 cm (Fits!)" },
      { label: "1/25", k: 0.04, desc: "Height = 16 cm (Fits!)" },
      { label: "1/5", k: 0.2, desc: "Height = 80 cm" },
    ],
  },
  {
    id: 2,
    landmark: "The Grand Pavilion 🏛️",
    realHeight: 300,
    realBaseArea: 10000, // cm²
    realVolume: 90000,
    constraintType: "Base Area Budget",
    limitDesc: "Base area must not exceed 100 cm² on the display plinth (Area scales by k²!)",
    validTest: (k, h, a, v) => a <= 100,
    scales: [
      { label: "1/5", k: 0.2, desc: "Area = 10,000 × (1/5)² = 400 cm²" },
      { label: "1/8", k: 0.125, desc: "Area = 10,000 × (1/8)² = 156 cm²" },
      { label: "1/10", k: 0.1, desc: "Area = 10,000 × (1/10)² = 100 cm² (Fits!)" },
      { label: "1/20", k: 0.05, desc: "Area = 10,000 × (1/20)² = 25 cm² (Fits!)" },
    ],
  },
  {
    id: 3,
    landmark: "The Bronze Fountain ⛲",
    realHeight: 250,
    realBaseArea: 4000,
    realVolume: 80000, // mL
    constraintType: "Water Volume Limit",
    limitDesc: "Model reservoir capacity must be ≤ 150 mL (Volume scales by k³!)",
    validTest: (k, h, a, v) => v <= 150,
    scales: [
      { label: "1/4", k: 0.25, desc: "Vol = 80,000 × (1/4)³ = 1,250 mL" },
      { label: "1/6", k: 0.1667, desc: "Vol = 80,000 × (1/6)³ = 370 mL" },
      { label: "1/8", k: 0.125, desc: "Vol = 80,000 × (1/8)³ = 156 mL" },
      { label: "1/10", k: 0.1, desc: "Vol = 80,000 × (1/10)³ = 80 mL (Fits!)" },
    ],
  },
];

export default function ScaleToFit({ onComplete, audioEnabled = true }) {
  const [exhibitIdx, setExhibitIdx] = useState(0);
  const [selectedScaleIdx, setSelectedScaleIdx] = useState(0);
  const [solvedExhibits, setSolvedExhibits] = useState(new Set());

  const currentExhibit = EXHIBITS[exhibitIdx];
  const scaleChoice = currentExhibit.scales[selectedScaleIdx];
  const k = scaleChoice.k;

  const modelH = Math.round(currentExhibit.realHeight * k * 10) / 10;
  const modelArea = Math.round(currentExhibit.realBaseArea * Math.pow(k, 2) * 10) / 10;
  const modelVol = Math.round(currentExhibit.realVolume * Math.pow(k, 3) * 10) / 10;

  const fits = currentExhibit.validTest(k, modelH, modelArea, modelVol);

  function handleCheckAndSave() {
    if (fits) {
      const nextSet = new Set(solvedExhibits);
      nextSet.add(exhibitIdx);
      setSolvedExhibits(nextSet);
    }
  }

  function handleNextExhibit() {
    setSelectedScaleIdx(0);
    setExhibitIdx((exhibitIdx + 1) % EXHIBITS.length);
  }

  const isComplete = solvedExhibits.size >= 2;

  return (
    <div className="station-container">
      <div className="station-header">
        <div className="station-title-row">
          <span className="station-badge">Station B · Build-to-Target Challenge</span>
          <h2 className="station-title">Scale to Fit 📐</h2>
        </div>
        <p className="station-instruction">
          Target the scale factor so the miniature model fits within the exhibition constraint (Height k, Area k², Volume k³)!
        </p>
      </div>

      <div className="station-workspace">
        <div className="station-grid-2col">
          {/* Left Column: Landmark & Constraints */}
          <div className="station-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold)' }}>
                  {currentExhibit.landmark}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#a0a0b8' }}>
                  Exhibit {exhibitIdx + 1} of {EXHIBITS.length}
                </span>
              </div>

              {/* Constraint Alert */}
              <div style={{
                marginTop: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(249,199,79,0.15)',
                border: '1px solid rgba(249,199,79,0.4)',
              }}>
                <div style={{ fontSize: '0.78rem', color: '#F9C74F', fontWeight: 800 }}>
                  🎯 TARGET CONSTRAINT: {currentExhibit.constraintType}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600, marginTop: '2px' }}>
                  {currentExhibit.limitDesc}
                </div>
              </div>

              {/* Real Landmark Dimensions */}
              <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.78rem', textAlign: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>
                  <div style={{ color: '#a0a0b8' }}>Real Height</div>
                  <div style={{ fontWeight: 800 }}>{currentExhibit.realHeight} cm</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>
                  <div style={{ color: '#a0a0b8' }}>Real Base Area</div>
                  <div style={{ fontWeight: 800 }}>{currentExhibit.realBaseArea} cm²</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>
                  <div style={{ color: '#a0a0b8' }}>Real Volume</div>
                  <div style={{ fontWeight: 800 }}>{currentExhibit.realVolume} mL</div>
                </div>
              </div>
            </div>

            {/* Model Preview Visual */}
            <div style={{
              background: 'rgba(10, 15, 35, 0.85)',
              border: `2px solid ${fits ? '#4caf50' : '#ef5350'}`,
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '110px',
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: fits ? '#81c784' : '#ef5350' }}>
                {fits ? '✓ FITS EXHIBIT CONSTRAINT!' : '❌ EXCEEDS DISPLAY BUDGET!'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                Scale k = {scaleChoice.label} ➔ Height: {modelH} cm | Area: {modelArea} cm² | Vol: {modelVol} mL
              </div>
            </div>
          </div>

          {/* Right Column: Scale Choices & Next Exhibit */}
          <div className="station-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--gold)' }}>
              Choose Model Scale Factor:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentExhibit.scales.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`btn ${selectedScaleIdx === idx ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                  }}
                  onClick={() => setSelectedScaleIdx(idx)}
                >
                  <span style={{ fontWeight: 800 }}>Scale {s.label}</span>
                  <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>{s.desc}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={handleCheckAndSave}
                disabled={!fits}
              >
                {solvedExhibits.has(exhibitIdx) ? 'Saved ✓' : 'Lock In Scale 🔒'}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={handleNextExhibit}
              >
                Next Exhibit ➔
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#a0a0b8', marginTop: '4px' }}>
              Exhibits Fitted: {solvedExhibits.size} of 2 required ({Array.from(solvedExhibits).map(i => `#${i + 1}`).join(', ') || 'none yet'})
            </div>
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
              🎉 Target Achieved! You scaled models to fit height, area, and volume constraints!
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
