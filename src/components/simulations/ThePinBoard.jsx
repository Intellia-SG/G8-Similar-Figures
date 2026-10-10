// src/components/simulations/ThePinBoard.jsx
import React, { useState } from 'react';
import './Stations.css';

const PIN_TRIOS = [
  {
    id: 'sss',
    label: 'SSS (3 Sides)',
    sides: 3,
    angles: 0,
    isTest: true,
    ruleTitle: 'Side-Side-Side (SSS) Criterion',
    ruleText: 'Three fixed timber beams bolted together form a completely rigid frame. A triangle cannot deform without changing at least one side length.',
    stageMetaphor: 'Backstage standard: When Haikal cuts 3 beams to exact lengths, every copy will fit the mounting bracket identically.',
  },
  {
    id: 'sas',
    label: 'SAS (2 Sides + Included Angle)',
    sides: 2,
    angles: 1,
    includedAngle: true,
    isTest: true,
    ruleTitle: 'Side-Angle-Side (SAS) Criterion',
    ruleText: 'The included angle locks the hinge angle between the two fixed sides. This pins the distance between their outer endpoints, leaving only ONE possible third side.',
    stageMetaphor: 'Clamping two timber legs at a fixed angle fixes the span for the stage brace with zero wiggle room.',
  },
  {
    id: 'asa',
    label: 'ASA (2 Angles + Included Side)',
    sides: 1,
    angles: 2,
    includedSide: true,
    isTest: true,
    ruleTitle: 'Angle-Side-Angle (ASA) Criterion',
    ruleText: 'The baseline length is fixed, and the two angles specify the exact trajectories of the two rising beams. Two straight lines can intersect at only ONE point.',
    stageMetaphor: 'Li Ting sets the base rail and aims two spotlights at specified angles; the beams cross at a unique point in space.',
  },
  {
    id: 'aas',
    label: 'AAS (2 Angles + Non-Included Side)',
    sides: 1,
    angles: 2,
    includedSide: false,
    isTest: true,
    ruleTitle: 'Angle-Angle-Side (AAS) Criterion',
    ruleText: 'Since the angles of a triangle always sum to 180°, knowing two angles automatically calculates the third (180° - ∠1 - ∠2). This mathematically reduces AAS to ASA!',
    stageMetaphor: 'Even with a non-included side, the third angle is automatically locked by the 180° rule.',
  },
  {
    id: 'rhs',
    label: 'RHS (Right Angle + Hypotenuse + Leg)',
    sides: 2,
    angles: 1,
    isRightAngle: true,
    hasHypotenuseAndLeg: true,
    isTest: true,
    ruleTitle: 'Right-Angle Hypotenuse Leg (RHS) Criterion',
    ruleText: 'In a right triangle, the Pythagorean theorem (a² + b² = c²) dictates that knowing the hypotenuse and one leg uniquely fixes the remaining leg. Equivalent to SSS!',
    stageMetaphor: 'Right-angled stage wings are squared with a carpenter\'s 90° square, guaranteeing identical duplicates.',
  },
  {
    id: 'ssa',
    label: 'SSA (2 Sides + Non-Included Angle)',
    sides: 2,
    angles: 1,
    includedAngle: false,
    isTest: false,
    ruleTitle: '⚠️ The SSA Ambiguity Trap (NOT a Congruence Test)',
    ruleText: 'When the angle is NOT between the two sides, the free arm can swing like a pendulum across the baseline, cutting it at TWO different locations: one acute (B₁) and one obtuse (B₂)!',
    stageMetaphor: 'Crucial warning: Two stage flats built with identical SSA measurements can end up with completely different shapes!',
  },
  {
    id: 'aaa',
    label: 'AAA (3 Angles, No Sides)',
    sides: 0,
    angles: 3,
    isTest: false,
    ruleTitle: '⚠️ The AAA Similarity Trap (NOT a Congruence Test)',
    ruleText: 'Knowing all 3 angles fixes the proportions and shape of the triangle, but does NOT determine its size! Triangles can be enlarged or shrunk infinitely like a film projector.',
    stageMetaphor: 'A miniature model flat and a full-size stage flat have identical angles, but are NOT congruent because sizes differ.',
  },
];

export default function ThePinBoard({ onComplete, _audioEnabled }) {
  const [selectedTrio, setSelectedTrio] = useState(PIN_TRIOS[1]); // start with SAS
  const [wiggle, setWiggle] = useState(0); // slider -15 to 15
  const [explored, setExplored] = useState(new Set(['sas']));
  const [, setConfirmAnswered] = useState(false);
  const [confirmSelected, setConfirmSelected] = useState(null);
  const [completed, setCompleted] = useState(false);

  function handleSelectTrio(trio) {
    setSelectedTrio(trio);
    const nextExplored = new Set(explored);
    nextExplored.add(trio.id);
    setExplored(nextExplored);
  }

  const isAmbiguous = selectedTrio.id === 'ssa';
  const isScaleOnly = selectedTrio.id === 'aaa';
  const isTest = selectedTrio.isTest;

  // Criteria for completion: explored at least 2 valid tests AND both non-tests (ssa & aaa)
  const testsExploredCount = Array.from(explored).filter(id => PIN_TRIOS.find(p => p.id === id)?.isTest).length;
  const hasExploredSSA = explored.has('ssa');
  const hasExploredAAA = explored.has('aaa');
  const canShowConfirmation = testsExploredCount >= 2 && hasExploredSSA && hasExploredAAA;

  function handleAnswerConfirmation(optIdx) {
    setConfirmSelected(optIdx);
    if (optIdx === 0) {
      setConfirmAnswered(true);
      setCompleted(true);
    }
  }

  return (
    <div className="station-container">
      {/* Sleek Compact Header */}
      <div className="station-header">
        <div className="station-title-row">
          <span className="station-badge">📌 Station A</span>
          <h2 className="station-title">The Pin Board</h2>
        </div>
        <p className="station-instruction">
          Pin three parts onto the timber frame. Wiggle the free vertex to discover whether the frame is rigidly locked into ONE triangle, or swings into multiple shapes!
        </p>
      </div>

      <div className="station-workspace">
        {/* Trio Selector Chips */}
        <div className="station-controls-row">
          {PIN_TRIOS.map(trio => {
            const isSel = selectedTrio.id === trio.id;
            const isExp = explored.has(trio.id);
            return (
              <button
                key={trio.id}
                type="button"
                className={`pin-chip ${isSel ? 'active' : ''} ${isExp ? 'explored' : ''}`}
                onClick={() => handleSelectTrio(trio)}
                aria-label={`Select pin trio: ${trio.label}`}
              >
                {trio.id.toUpperCase()} {isExp ? '✓' : ''}
              </button>
            );
          })}
        </div>

        <div className="station-grid-2col">
          {/* Left Column: Interactive Visual Canvas & Wiggle Slider */}
          <div className="station-col">
            <div className="station-canvas-card">
              <svg viewBox="0 0 400 155" style={{ width: '100%', height: '145px', overflow: 'visible' }}>
                <line x1="20" y1="130" x2="380" y2="130" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 4" />

                {isAmbiguous ? (
                  /* SSA Ambiguous Double Render with swinging arc */
                  <>
                    <line x1="50" y1="125" x2="360" y2="125" stroke="#718096" strokeWidth="2" strokeDasharray="5 5" />
                    <line x1="50" y1="125" x2="190" y2="35" stroke="#38bdf8" strokeWidth="3.5" />
                    <text x="100" y="75" fill="#38bdf8" fontSize="13" fontWeight="bold">Side b = 8 cm</text>

                    <path
                      d="M 120,125 A 95,95 0 0,0 280,125"
                      fill="none"
                      stroke="rgba(251, 191, 36, 0.65)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    <line x1="190" y1="35" x2="280" y2="125" stroke="#22c55e" strokeWidth="3.5" />
                    <line x1="50" y1="125" x2="280" y2="125" stroke="#22c55e" strokeWidth="2.5" />

                    <line x1="190" y1="35" x2="120" y2="125" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="5 4" />
                    <line x1="50" y1="125" x2="120" y2="125" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 4" />

                    <circle cx="50" cy="125" r="6" fill="#f59e0b" />
                    <circle cx="190" cy="35" r="6" fill="#38bdf8" />
                    <circle cx="280" cy="125" r="6" fill="#22c55e" />
                    <circle cx="120" cy="125" r="6" fill="#ef4444" />

                    <text x="35" y="146" fill="#f59e0b" fontSize="14" fontWeight="bold">A (30°)</text>
                    <text x="190" y="24" fill="#fff" fontSize="15" fontWeight="bold">C</text>
                    <text x="275" y="146" fill="#22c55e" fontSize="13" fontWeight="bold">B₁ (Acute)</text>
                    <text x="90" y="146" fill="#ef4444" fontSize="13" fontWeight="bold">B₂ (Obtuse)</text>
                    <text x="205" y="90" fill="#f59e0b" fontSize="13" fontWeight="bold">Swinging Arm (6 cm)</text>
                  </>
                ) : isScaleOnly ? (
                  /* AAA Similarity Scale Render */
                  <>
                    <polygon points="50,125 105,45 150,125" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="3" />
                    <circle cx="50" cy="125" r="5" fill="#38bdf8" />
                    <circle cx="105" cy="45" r="5" fill="#38bdf8" />
                    <circle cx="150" cy="125" r="5" fill="#38bdf8" />
                    <text x="50" y="145" fill="#38bdf8" fontSize="13" fontWeight="bold">Small Flat (1x)</text>

                    <polygon points="210,125 295,20 365,125" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="3" />
                    <circle cx="210" cy="125" r="5" fill="#fbbf24" />
                    <circle cx="295" cy="20" r="5" fill="#fbbf24" />
                    <circle cx="365" cy="125" r="5" fill="#fbbf24" />
                    <text x="235" y="145" fill="#fbbf24" fontSize="13" fontWeight="bold">Large Flat (1.6x)</text>
                  </>
                ) : (
                  /* Rigid Locked Test Render */
                  <>
                    <polygon
                      points={`60,125 ${180 + wiggle},30 310,125`}
                      fill="rgba(34, 197, 94, 0.22)"
                      stroke="#22c55e"
                      strokeWidth="3.5"
                    />

                    {selectedTrio.id === 'rhs' && (
                      <path d="M 60,105 L 80,105 L 80,125" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
                    )}

                    {(selectedTrio.id === 'sas' || selectedTrio.id === 'asa' || selectedTrio.id === 'aas') && (
                      <path d="M 85,125 A 25,25 0 0,0 78,110" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
                    )}

                    <circle cx="60" cy="125" r="6" fill="#f59e0b" />
                    <circle cx={180 + wiggle} cy="30" r="6" fill="#22c55e" />
                    <circle cx="310" cy="125" r="6" fill="#f59e0b" />

                    <text x="45" y="146" fill="#fff" fontSize="14" fontWeight="bold">A</text>
                    <text x={165 + wiggle} y="18" fill="#22c55e" fontSize="14" fontWeight="bold">Locked Vertex C</text>
                    <text x="315" y="146" fill="#fff" fontSize="14" fontWeight="bold">B</text>

                    <text x="135" y="90" fill="rgba(34, 197, 94, 0.85)" fontSize="13" fontWeight="bold">
                      🔒 RIGID FRAME LOCKED
                    </text>
                  </>
                )}
              </svg>
            </div>

            {/* Wiggle Slider (for locked test) */}
            {isTest && (
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '10px', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                  Wiggle frame:
                </span>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  value={wiggle}
                  onChange={e => setWiggle(Number(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--gold)', height: '8px', cursor: 'pointer' }}
                  aria-label="Wiggle vertex slider"
                />
                <span style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--gold)', minWidth: '40px', textAlign: 'right' }}>
                  {wiggle > 0 ? `+${wiggle}°` : `${wiggle}°`}
                </span>
              </div>
            )}

            {/* Progress Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--gold)' }}>
                Explored: {explored.size}/7 combinations
              </span>
              <span style={{ fontSize: '0.85rem', color: canShowConfirmation ? '#86efac' : 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                {canShowConfirmation ? "✓ Ready to Certify" : "Need 2 tests + SSA + AAA"}
              </span>
            </div>
          </div>

          {/* Right Column: Progressive display (Feedback + Rule or Question or Success) */}
          <div className="station-col">
            {/* Live Feedback Status Banner */}
            <div className={`station-feedback-box ${isTest ? 'test' : isAmbiguous ? 'ambiguous' : 'info'}`}>
              {isTest ? (
                <>🔒 <strong>LOCKED (Valid Test):</strong> Only ONE triangle can possibly be formed! Every copy built with {selectedTrio.id.toUpperCase()} will match identically.</>
              ) : isAmbiguous ? (
                <>⚠️ <strong>AMBIGUOUS TRAP (Not a Test):</strong> Two different triangles can be formed with these identical measurements! SSA cannot guarantee a match.</>
              ) : (
                <>📐 <strong>SIMILARITY ONLY:</strong> AAA fixes the angles, but side lengths can scale up or down indefinitely like a projector.</>
              )}
            </div>

            {/* When Completed: Success Card */}
            {completed ? (
              <div className="station-success-card">
                <div className="station-success-icon">🎟️</div>
                <div className="station-success-title">The Pin Board Mastered!</div>
                <p className="station-success-desc">
                  You've mathematically verified why SSS, SAS, ASA, AAS, and RHS lock a triangle, while SSA swings ambiguously and AAA allows infinite scaling!
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onComplete}
                  style={{ padding: '8px 24px', fontSize: '1.05rem', fontWeight: 900 }}
                >
                  Complete Station A ✓
                </button>
              </div>
            ) : canShowConfirmation ? (
              /* When Ready: Confirmation Question Gate */
              <div className="confirm-question-card">
                <span className="confirm-question-title">
                  🧠 Backstage Certification: Why can the SSA frame take two different shapes?
                </span>
                {[
                  "The non-included side swings in a circular arc, intersecting the baseline at two points (one acute, one obtuse)",
                  "Because all triangles must have angles that sum to 360 degrees",
                  "Because timber flats cannot be measured with right angles",
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`sim-option-btn ${confirmSelected === i ? (i === 0 ? 'correct' : 'wrong') : ''}`}
                    onClick={() => handleAnswerConfirmation(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              /* Normal Exploration: Geometric Rule Card */
              <div className="station-info-card">
                <div className="station-info-title">
                  <span>📘</span> {selectedTrio.ruleTitle}
                </div>
                <p className="station-info-body">
                  {selectedTrio.ruleText}
                </p>
                <div style={{ marginTop: '2px', padding: '6px 10px', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '8px', borderLeft: '3px solid var(--gold)', fontSize: '0.9rem', color: '#fef08a', fontWeight: 600 }}>
                  🎭 {selectedTrio.stageMetaphor}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

