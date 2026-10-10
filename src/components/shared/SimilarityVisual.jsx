// src/components/shared/SimilarityVisual.jsx
import React, { useState } from 'react';

/**
 * SimilarityVisual — Dynamic SVG & Diagram Component for SimilarQuest
 * TRD §5.1: Supports:
 * - "figure-pair"
 * - "scale-overlay"
 * - "nested-triangles" (with "Show Separately" toggle)
 * - "correspondence-table"
 * - "ratio-table"
 * - "solid-pair"
 * - "map-strip"
 * - "argument-chain"
 * Built with accessible text descriptions, high visual polish, and no color-only indicators.
 */
export default function SimilarityVisual({ type = 'figure-pair', data = {}, compact = false }) {
  const [showSeparated, setShowSeparated] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(15, 25, 45, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: compact ? '8px 12px' : '14px 18px',
    margin: '8px auto',
    width: '100%',
    maxWidth: compact ? '500px' : '580px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
    userSelect: 'none',
  };

  const svgStyle = {
    width: '100%',
    maxWidth: compact ? '340px' : '420px',
    height: compact ? '150px' : '180px',
    overflow: 'visible',
  };

  // 1. Correspondence Table
  if (type === 'correspondence-table') {
    const t1 = data.t1 || ['A', 'B', 'C'];
    const t2 = data.t2 || ['P', 'Q', 'R'];
    return (
      <div style={containerStyle} role="region" aria-label="Vertex Correspondence Table">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>📋</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            Vertex &amp; Side Correspondence
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '10px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ background: 'rgba(77,144,142,0.2)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(77,144,142,0.4)' }}>
            <span style={{ fontWeight: 800, color: '#4D908E' }}>{t1[0]} ⟷ {t2[0]}</span>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>1st Vertex</div>
          </div>
          <div style={{ background: 'rgba(249,199,79,0.2)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(249,199,79,0.4)' }}>
            <span style={{ fontWeight: 800, color: '#F9C74F' }}>{t1[1]} ⟷ {t2[1]}</span>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>2nd Vertex</div>
          </div>
          <div style={{ background: 'rgba(248,150,30,0.2)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(248,150,30,0.4)' }}>
            <span style={{ fontWeight: 800, color: '#F8961E' }}>{t1[2]} ⟷ {t2[2]}</span>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>3rd Vertex</div>
          </div>
        </div>
        {data.statement && (
          <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
            Similarity Statement: <strong style={{ color: 'var(--gold)' }}>{data.statement}</strong>
          </div>
        )}
      </div>
    );
  }

  // 2. Ratio Table
  if (type === 'ratio-table') {
    return (
      <div style={containerStyle} role="region" aria-label="Scale Factor and Ratio Comparison">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🔁</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            Scale Factor &amp; Side Ratios
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '12px 20px',
          borderRadius: '12px',
          width: '100%',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Figure A</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4D908E' }}>{data.sideA ?? 6} cm</div>
          </div>
          <div style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>➔</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Figure B</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8961E' }}>{data.sideB ?? 15} cm</div>
          </div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
          Direction: <strong style={{ color: 'var(--gold)' }}>{data.direction || 'figure A to figure B'}</strong>
        </div>
      </div>
    );
  }

  // 3. Nested Triangles (with "Show Separately" toggle)
  if (type === 'nested-triangles') {
    const AD = data.AD ?? 4;
    const AB = data.AB ?? 12;
    const DE = data.DE ?? 5;
    const BC = data.BC ?? 15;

    return (
      <div style={containerStyle} role="region" aria-label="Nested Similar Triangles with Parallel Line">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--gold)', fontWeight: 700 }}>
            📐 DE ∥ BC (Parallel Line inside △ABC)
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', padding: '3px 8px' }}
            onClick={() => setShowSeparated(!showSeparated)}
          >
            {showSeparated ? 'Show Overlapping' : 'Show Separately 🔍'}
          </button>
        </div>

        {!showSeparated ? (
          <svg viewBox="0 0 240 160" style={svgStyle} aria-label="Nested triangles diagram">
            {/* Big triangle ABC */}
            <polygon points="120,20 30,140 210,140" fill="rgba(77,144,142,0.18)" stroke="#4D908E" strokeWidth="2.5" />
            {/* Parallel line DE */}
            <line x1="65" y1="92" x2="175" y2="92" stroke="#F9C74F" strokeWidth="2.5" strokeDasharray="4 2" />
            {/* Small triangle ADE highlight */}
            <polygon points="120,20 65,92 175,92" fill="rgba(249,199,79,0.22)" stroke="#F9C74F" strokeWidth="2" />

            {/* Parallel arrows */}
            <path d="M 115 92 L 123 88 L 123 96 Z" fill="#F9C74F" />
            <path d="M 115 140 L 123 136 L 123 144 Z" fill="#4D908E" />

            {/* Labels */}
            <text x="120" y="15" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">A</text>
            <text x="20" y="145" fill="#fff" fontSize="11" fontWeight="700">B</text>
            <text x="215" y="145" fill="#fff" fontSize="11" fontWeight="700">C</text>
            <text x="50" y="94" fill="#F9C74F" fontSize="11" fontWeight="700">D</text>
            <text x="182" y="94" fill="#F9C74F" fontSize="11" fontWeight="700">E</text>

            {/* Dimension indicators */}
            <text x="75" y="52" fill="#ffe082" fontSize="9" fontWeight="600">{AD} cm</text>
            <text x="120" y="87" fill="#F9C74F" fontSize="9" fontWeight="700" textAnchor="middle">{DE} cm</text>
            <text x="120" y="155" fill="#4D908E" fontSize="9" fontWeight="700" textAnchor="middle">BC = {BC} cm</text>
          </svg>
        ) : (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            {/* Separated Small Triangle ADE */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#F9C74F', fontWeight: 700 }}>△ADE (Model)</div>
              <svg viewBox="0 0 100 90" style={{ width: '110px', height: '80px' }}>
                <polygon points="50,10 15,80 85,80" fill="rgba(249,199,79,0.25)" stroke="#F9C74F" strokeWidth="2" />
                <text x="50" y="8" fill="#fff" fontSize="9" textAnchor="middle">A</text>
                <text x="10" y="85" fill="#fff" fontSize="9">D</text>
                <text x="90" y="85" fill="#fff" fontSize="9">E</text>
                <text x="25" y="45" fill="#ffe082" fontSize="8">{AD}</text>
                <text x="50" y="77" fill="#ffe082" fontSize="8" textAnchor="middle">{DE}</text>
              </svg>
            </div>
            <div style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 800 }}>∼</div>
            {/* Separated Large Triangle ABC */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#4D908E', fontWeight: 700 }}>△ABC (Original)</div>
              <svg viewBox="0 0 130 110" style={{ width: '140px', height: '100px' }}>
                <polygon points="65,10 15,100 115,100" fill="rgba(77,144,142,0.25)" stroke="#4D908E" strokeWidth="2" />
                <text x="65" y="8" fill="#fff" fontSize="9" textAnchor="middle">A</text>
                <text x="8" y="105" fill="#fff" fontSize="9">B</text>
                <text x="120" y="105" fill="#fff" fontSize="9">C</text>
                <text x="30" y="55" fill="#4D908E" fontSize="8">{AB}</text>
                <text x="65" y="97" fill="#4D908E" fontSize="8" textAnchor="middle">{BC}</text>
              </svg>
            </div>
          </div>
        )}
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
          Note: In nested figures, compare whole side AB with AD, never the piece DB!
        </div>
      </div>
    );
  }

  // 4. Scale Overlay (Length k vs Area k² with Unit Squares)
  if (type === 'scale-overlay') {
    const k = data.k || 2;
    return (
      <div style={containerStyle} role="region" aria-label="Scale Overlay: Length vs Area">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.1rem' }}>🧊</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            Length Scales by k ➔ Area Scales by k²!
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {/* 1x1 Square */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#4D908E', marginBottom: '4px' }}>Base Figure (1×1)</div>
            <div style={{
              width: '40px',
              height: '40px',
              border: '2px solid #4D908E',
              background: 'rgba(77,144,142,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}>
              1 unit²
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>Side = 1</div>
          </div>

          <div style={{ fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 800 }}>➔ ×{k}</div>

          {/* kxk Square showing unit squares grid */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#F8961E', marginBottom: '4px' }}>Scaled ({k}×{k})</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${k}, 40px)`,
              gridTemplateRows: `repeat(${k}, 40px)`,
              border: '2px solid #F8961E',
              background: 'rgba(248,150,30,0.15)',
            }}>
              {Array.from({ length: k * k }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px dashed rgba(248,150,30,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: '#ffe082',
                  }}
                >
                  1
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginTop: '3px', fontWeight: 700 }}>
              Side = {k} · Area = {k * k} units²
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Solid Pair (Cuboids / 3D Solids for Volume k³)
  if (type === 'solid-pair') {
    const k = data.k || 2;
    return (
      <div style={containerStyle} role="region" aria-label="Similar Solids Volume Comparison">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.1rem' }}>🧊</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            Volume Scales by k³ = {k}³ = {Math.pow(k, 3)}!
          </span>
        </div>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-end', justifyContent: 'center', width: '100%', padding: '10px 0' }}>
          {/* Small Solid */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, rgba(77,144,142,0.8), rgba(77,144,142,0.3))',
              border: '2px solid #4D908E',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}>
              {data.volA ?? 50} mL
            </div>
            <div style={{ fontSize: '0.72rem', color: '#4D908E', marginTop: '4px', fontWeight: 700 }}>Small Model</div>
          </div>

          <div style={{ fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 800, marginBottom: '20px' }}>
            ➔ k = {k}
          </div>

          {/* Large Solid */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '90px',
              height: '90px',
              background: 'linear-gradient(135deg, rgba(243,114,44,0.8), rgba(243,114,44,0.3))',
              border: '2px solid #F3722C',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#fff',
            }}>
              {data.volB ?? 400} mL
            </div>
            <div style={{ fontSize: '0.72rem', color: '#F3722C', marginTop: '4px', fontWeight: 700 }}>Full Landmark</div>
          </div>
        </div>
      </div>
    );
  }

  // 6. Map Strip (Map scale bar and distance)
  if (type === 'map-strip') {
    const scaleN = data.scaleN || 50000;
    const mapCm = data.mapCm || 4;
    const realKm = data.realKm || 2;
    return (
      <div style={containerStyle} role="region" aria-label="Map Scale Bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🗺️</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            Exhibition Map Scale · 1 : {scaleN.toLocaleString()}
          </span>
        </div>
        <div style={{
          width: '90%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          padding: '12px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
            <span>Map Distance: <strong style={{ color: '#F9C74F' }}>{mapCm} cm</strong></span>
            <span>Real Distance: <strong style={{ color: '#90BE6D' }}>{realKm} km</strong></span>
          </div>
          {/* Visual scale ruler */}
          <div style={{ height: '8px', background: '#334155', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #F9C74F, #90BE6D)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            <span>0 cm</span>
            <span>1 cm = {(scaleN / 100000)} km</span>
            <span>{mapCm} cm</span>
          </div>
        </div>
      </div>
    );
  }

  // 7. Argument Chain
  if (type === 'argument-chain') {
    const steps = data.steps || [
      { text: "∠A is a common angle to both triangles", reason: "(common angle)" },
      { text: "∠ADE = ∠ABC (since DE ∥ BC)", reason: "(corr. ∠s, // lines)" },
      { text: "∴ △ADE ∼ △ABC", reason: "(AA criterion)" },
      { text: "BC / DE = AB / AD = 3", reason: "(corr. sides of ∼ △s)" },
    ];
    return (
      <div style={containerStyle} role="region" aria-label="Structured Similarity Proof Argument">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🪢</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            Structured Similarity Proof
          </span>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {steps.map((st, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                borderLeft: '3px solid var(--gold)',
                fontSize: '0.85rem',
              }}
            >
              <span style={{ fontWeight: 600 }}>{st.text}</span>
              <span style={{ color: 'var(--gold-light)', fontStyle: 'italic', fontSize: '0.8rem' }}>{st.reason}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. Default: Figure Pair
  const figA = data.figA || { w: 60, h: 40, label: 'Figure A' };
  const figB = data.figB || { w: 120, h: 80, label: 'Figure B' };

  return (
    <div style={containerStyle} role="region" aria-label="Similar or Comparative Figure Pair">
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '10px 0' }}>
        {/* Figure A */}
        <div style={{ textAlign: 'center' }}>
          <svg viewBox="0 0 100 80" style={{ width: '110px', height: '80px' }}>
            <rect x="15" y="15" width="70" height="50" fill="rgba(77,144,142,0.25)" stroke="#4D908E" strokeWidth="2" rx="4" />
            <text x="50" y="45" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="700">
              {figA.w} × {figA.h}
            </text>
          </svg>
          <div style={{ fontSize: '0.78rem', color: '#4D908E', fontWeight: 700, marginTop: '2px' }}>
            {figA.label || 'Figure A'}
          </div>
        </div>

        <div style={{ fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 800 }}>vs</div>

        {/* Figure B */}
        <div style={{ textAlign: 'center' }}>
          <svg viewBox="0 0 140 100" style={{ width: '140px', height: '90px' }}>
            <rect x="10" y="10" width="120" height="80" fill="rgba(249,199,79,0.2)" stroke="#F9C74F" strokeWidth="2" rx="6" />
            <text x="70" y="55" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="700">
              {figB.w} × {figB.h}
            </text>
          </svg>
          <div style={{ fontSize: '0.78rem', color: '#F9C74F', fontWeight: 700, marginTop: '2px' }}>
            {figB.label || 'Figure B'}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
        Diagram for reference · Not drawn to exact scale
      </div>
    </div>
  );
}
