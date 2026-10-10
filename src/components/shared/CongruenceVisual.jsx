// src/components/shared/CongruenceVisual.jsx
import React, { useState } from 'react';

/**
 * CongruenceVisual — Dynamic SVG & Diagram Component for CongruenceQuest
 * Supports: 'triangle-pair', 'overlap-figure', 'correspondence-table', 'argument-chain', 'pin-board'
 * Built with accessible text descriptions, high visual polish, and no color-only indicators.
 */
export default function CongruenceVisual({ type = 'triangle-pair', data = {}, compact = false }) {
  const [showSeparated, setShowSeparated] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(15, 15, 45, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: compact ? '8px 12px' : '14px 18px',
    margin: '8px auto',
    width: '100%',
    maxWidth: compact ? '480px' : '560px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    userSelect: 'none',
  };

  const svgStyle = {
    width: '100%',
    maxWidth: compact ? '320px' : '400px',
    height: compact ? '140px' : '170px',
    overflow: 'visible',
  };

  // 1. Correspondence Table
  if (type === 'correspondence-table') {
    return (
      <div style={containerStyle} role="region" aria-label="Vertex Correspondence Table">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>📋</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            Vertex Correspondence Map
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
          <div style={{ background: 'rgba(231,111,81,0.15)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(231,111,81,0.4)' }}>
            <span style={{ fontWeight: 800, color: '#f39c12' }}>A ⟷ P</span>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>1st Vertex</div>
          </div>
          <div style={{ background: 'rgba(42,157,143,0.15)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(42,157,143,0.4)' }}>
            <span style={{ fontWeight: 800, color: '#2ecc71' }}>B ⟷ Q</span>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>2nd Vertex</div>
          </div>
          <div style={{ background: 'rgba(61,90,128,0.2)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(61,90,128,0.5)' }}>
            <span style={{ fontWeight: 800, color: '#3498db' }}>C ⟷ R</span>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>3rd Vertex</div>
          </div>
        </div>
        {data.statement && (
          <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
            Congruence Statement: <strong style={{ color: 'var(--gold)' }}>{data.statement}</strong>
          </div>
        )}
      </div>
    );
  }

  // 2. Argument Chain
  if (type === 'argument-chain') {
    const steps = data.steps || [
      { text: "AB = PQ", reason: "(given)" },
      { text: "∠B = ∠Q", reason: "(given)" },
      { text: "BC = QR", reason: "(given)" },
      { text: "∴ △ABC ≅ △PQR", reason: "(SAS criterion)" },
      { text: "Hence, AC = PR", reason: "(corr. sides of ≅ △s)" },
    ];

    return (
      <div style={containerStyle} role="region" aria-label="Structured Proof Argument">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🪢</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            Structured Proof Chain
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
                background: i === steps.length - 2 ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: i === steps.length - 2 ? '1px solid rgba(255, 193, 7, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{st.text}</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>{st.reason}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Pin Board (Concept Discovery Visual)
  if (type === 'pin-board') {
    return (
      <div style={containerStyle} role="region" aria-label="Pin Board Triangle Explorer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.2rem' }}>📌</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
            The Pin Board (Ambiguous SSA Case)
          </span>
        </div>
        <svg viewBox="0 0 340 160" style={svgStyle}>
          {/* Base ray */}
          <line x1="40" y1="130" x2="300" y2="130" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" />
          {/* Side b = 10 */}
          <line x1="40" y1="130" x2="160" y2="30" stroke="#3498db" strokeWidth="3" />
          {/* Acute triangle side a = 6 */}
          <line x1="160" y1="30" x2="240" y2="130" stroke="#2ecc71" strokeWidth="3" />
          {/* Obtuse triangle side a = 6 (dashed) */}
          <line x1="160" y1="30" x2="110" y2="130" stroke="#e74c3c" strokeWidth="3" strokeDasharray="3 3" />
          {/* Swing arc */}
          <path d="M 110,130 A 100,100 0 0,0 240,130" fill="none" stroke="rgba(255,193,7,0.6)" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* Vertex pins */}
          <circle cx="40" cy="130" r="5" fill="#f39c12" />
          <circle cx="160" cy="30" r="5" fill="#3498db" />
          <circle cx="240" cy="130" r="5" fill="#2ecc71" />
          <circle cx="110" cy="130" r="5" fill="#e74c3c" />

          {/* Labels */}
          <text x="30" y="145" fill="#fff" fontSize="11" fontWeight="bold">A (30°)</text>
          <text x="160" y="22" fill="#fff" fontSize="11" fontWeight="bold">C</text>
          <text x="245" y="145" fill="#2ecc71" fontSize="11" fontWeight="bold">B₁ (Acute)</text>
          <text x="90" y="145" fill="#e74c3c" fontSize="11" fontWeight="bold">B₂ (Obtuse)</text>
          <text x="90" y="70" fill="#3498db" fontSize="10">b = 10</text>
          <text x="210" y="70" fill="#2ecc71" fontSize="10">a = 6</text>
          <text x="125" y="90" fill="#e74c3c" fontSize="10">a = 6</text>
        </svg>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: '4px' }}>
          Notice how the 6 cm side can swing to two different locations, creating <strong style={{ color: '#2ecc71' }}>acute △AB₁C</strong> or <strong style={{ color: '#e74c3c' }}>obtuse △AB₂C</strong>!
        </div>
      </div>
    );
  }

  // 4. Overlap Figure
  if (type === 'overlap-figure') {
    return (
      <div style={containerStyle} role="region" aria-label="Overlapping Geometric Figure">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', fontSize: '0.92rem' }}>
            {showSeparated ? "Separated Triangles (Side-by-Side)" : "Overlapping Stage Figure"}
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowSeparated(!showSeparated)}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            aria-label={showSeparated ? "Show combined overlapping figure" : "Show separated triangles"}
          >
            {showSeparated ? "🔗 Combine" : "✂️ Show Separately"}
          </button>
        </div>

        {!showSeparated ? (
          <svg viewBox="0 0 320 160" style={svgStyle}>
            {/* Parallelogram ABCD with diagonal BD */}
            <polygon points="40,130 110,40 250,40 180,130" fill="rgba(124, 92, 191, 0.15)" stroke="#7c5cbf" strokeWidth="2" />
            {/* Common Diagonal BD */}
            <line x1="110" y1="40" x2="180" y2="130" stroke="#f1c40f" strokeWidth="3" />

            {/* Labels */}
            <text x="28" y="142" fill="#fff" fontSize="12" fontWeight="bold">A</text>
            <text x="105" y="32" fill="#fff" fontSize="12" fontWeight="bold">B</text>
            <text x="256" y="38" fill="#fff" fontSize="12" fontWeight="bold">C</text>
            <text x="180" y="145" fill="#fff" fontSize="12" fontWeight="bold">D</text>

            {/* Shared Side Badge */}
            <text x="145" y="80" fill="#f1c40f" fontSize="10" fontWeight="bold" transform="rotate(45, 145, 80)">
              Shared Edge BD
            </text>
          </svg>
        ) : (
          <svg viewBox="0 0 320 160" style={svgStyle}>
            {/* Triangle 1: ABD */}
            <polygon points="20,130 80,40 120,130" fill="rgba(231, 111, 81, 0.2)" stroke="#e76f51" strokeWidth="2" />
            <text x="10" y="140" fill="#fff" fontSize="11" fontWeight="bold">A</text>
            <text x="75" y="32" fill="#fff" fontSize="11" fontWeight="bold">B</text>
            <text x="122" y="140" fill="#fff" fontSize="11" fontWeight="bold">D</text>
            <line x1="80" y1="40" x2="120" y2="130" stroke="#f1c40f" strokeWidth="3" />

            {/* Triangle 2: CDB */}
            <polygon points="200,40 240,130 300,40" fill="rgba(42, 157, 143, 0.2)" stroke="#2a9d8f" strokeWidth="2" />
            <text x="190" y="35" fill="#fff" fontSize="11" fontWeight="bold">D</text>
            <text x="238" y="145" fill="#fff" fontSize="11" fontWeight="bold">B</text>
            <text x="305" y="35" fill="#fff" fontSize="11" fontWeight="bold">C</text>
            <line x1="200" y1="40" x2="240" y2="130" stroke="#f1c40f" strokeWidth="3" />
          </svg>
        )}

        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: '4px' }}>
          {data.description || "Segment BD is a shared (common) edge belonging to both △ABD and △CDB."}
        </div>
      </div>
    );
  }

  // 5. Standard Triangle Pair (default)
  return (
    <div style={containerStyle} role="region" aria-label="Triangle Pair Diagram">
      <svg viewBox="0 0 340 160" style={svgStyle}>
        {/* Triangle 1 (e.g. ABC) */}
        <polygon points="40,130 110,40 140,130" fill="rgba(52, 152, 219, 0.2)" stroke="#3498db" strokeWidth="2" />
        <text x="28" y="140" fill="#fff" fontSize="12" fontWeight="bold">A</text>
        <text x="105" y="30" fill="#fff" fontSize="12" fontWeight="bold">B</text>
        <text x="145" y="140" fill="#fff" fontSize="12" fontWeight="bold">C</text>

        {/* Tick marks on Triangle 1 */}
        <line x1="72" y1="83" x2="78" y2="87" stroke="#f1c40f" strokeWidth="2.5" />
        <line x1="123" y1="83" x2="127" y2="87" stroke="#2ecc71" strokeWidth="2.5" />
        <line x1="126" y1="80" x2="130" y2="84" stroke="#2ecc71" strokeWidth="2.5" />
        <line x1="88" y1="127" x2="88" y2="133" stroke="#e74c3c" strokeWidth="2.5" />

        {/* Triangle 2 (e.g. PQR) — flipped or rotated */}
        <polygon points="300,130 230,40 200,130" fill="rgba(46, 204, 113, 0.2)" stroke="#2ecc71" strokeWidth="2" />
        <text x="306" y="140" fill="#fff" fontSize="12" fontWeight="bold">P</text>
        <text x="225" y="30" fill="#fff" fontSize="12" fontWeight="bold">Q</text>
        <text x="188" y="140" fill="#fff" fontSize="12" fontWeight="bold">R</text>

        {/* Matching Tick marks on Triangle 2 */}
        <line x1="262" y1="83" x2="268" y2="87" stroke="#f1c40f" strokeWidth="2.5" />
        <line x1="213" y1="83" x2="217" y2="87" stroke="#2ecc71" strokeWidth="2.5" />
        <line x1="216" y1="80" x2="220" y2="84" stroke="#2ecc71" strokeWidth="2.5" />
        <line x1="248" y1="127" x2="248" y2="133" stroke="#e74c3c" strokeWidth="2.5" />
      </svg>
      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: '2px' }}>
        {data.description || "Triangle PQR is a flipped mirror-image of Triangle ABC. Notice matching tick marks!"}
      </div>
    </div>
  );
}
