// src/components/simulations/TheFullRehearsal.jsx
import React, { useState } from 'react';
import './Stations.css';
import { checkChain } from '../../utils/geoFacts.js';

export default function TheFullRehearsal({ onComplete, _audioEnabled }) {
  const [isSeparated, setIsSeparated] = useState(false);
  const [commonSideMarked, setCommonSideMarked] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [henceSelected, setHenceSelected] = useState(false);
  const [stepOrder, setStepOrder] = useState([0, 1, 2, 3, 4]); // permutation of proof steps
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);

  const proofSteps = [
    { id: 0, text: "AB = CD (given on stage blueprint)", type: 'fact', reason: 'given', badge: 'EVIDENCE 1' },
    { id: 1, text: "AD = CB (given on stage blueprint)", type: 'fact', reason: 'given', badge: 'EVIDENCE 2' },
    { id: 2, text: "BD = BD (common shared beam)", type: 'fact', reason: 'common-side', badge: 'SHARED EDGE' },
    { id: 3, text: "∴ △ABD ≅ △CDB (SSS criterion)", type: 'congruence', reason: 'sss', tri1: 'ABD', tri2: 'CDB', badge: 'CRITERION' },
    { id: 4, text: "Hence, ∠A = ∠C (corr. angles of ≅ △s)", type: 'deduction', reason: 'corresponding-parts-congruent-triangles', badge: 'DEDUCTION' },
  ];

  function moveStep(idx, dir) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= stepOrder.length) return;
    const nextOrder = [...stepOrder];
    const temp = nextOrder[idx];
    nextOrder[idx] = nextOrder[targetIdx];
    nextOrder[targetIdx] = temp;
    setStepOrder(nextOrder);
    setFeedback(null);
  }

  function validateFullRehearsal() {
    if (!commonSideMarked) {
      setFeedback({ valid: false, message: "Missing Evidence: Mark the hidden common shared edge BD first!" });
      return;
    }
    if (selectedTest !== 'SSS') {
      setFeedback({ valid: false, message: "Test Mismatch: Since all 3 pairs of corresponding sides are equal, the correct test is SSS!" });
      return;
    }
    if (!henceSelected) {
      setFeedback({ valid: false, message: "Incomplete: Don't forget to include the final 'Hence, ∠A = ∠C' deduction!" });
      return;
    }

    // Run checkChain on the ordered steps
    const currentChain = stepOrder.map(idx => proofSteps[idx]);
    checkChain(currentChain, [
      { type: 'side-equal', subject: 'AB=CD' },
      { type: 'side-equal', subject: 'AD=CB' },
      { type: 'common-side', subject: 'BD=BD' },
    ]);

    // Test must come after all 3 facts (indices 0, 1, 2)
    const testPos = stepOrder.indexOf(3);
    const hencePos = stepOrder.indexOf(4);
    const factsBeforeTest = [stepOrder.indexOf(0), stepOrder.indexOf(1), stepOrder.indexOf(2)].every(pos => pos < testPos);
    const henceAfterTest = testPos < hencePos;

    if (!factsBeforeTest) {
      setFeedback({
        valid: false,
        message: "Logical Order Error: All 3 evidence statements (AB=CD, AD=CB, BD=BD) must be stated BEFORE stating the congruence test!",
      });
      return;
    }

    if (!henceAfterTest) {
      setFeedback({
        valid: false,
        message: "Logical Order Error: The 'Hence' deduction can only be deduced AFTER congruence is proven!",
      });
      return;
    }

    setFeedback({ valid: true, message: "Bravo! Flawless logical proof chain approved with zero errors!" });
    setCompleted(true);
  }

  return (
    <div className="station-container">
      {/* Sleek Compact Header */}
      <div className="station-header">
        <div className="station-title-row">
          <span className="station-badge">🎭 Station C</span>
          <h2 className="station-title">The Full Rehearsal</h2>
        </div>
        <p className="station-instruction">
          Construct an end-to-end geometric proof: uncover the hidden beam, choose the test, and arrange the proof chain!
        </p>
      </div>

      <div className="station-workspace">
        <div className="station-grid-2col">
          {/* Left Column: Overlapping Set Diagram & Clues Panel */}
          <div className="station-col">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, color: 'var(--gold)', fontSize: '1.15rem' }}>
                Stage Flat: Quadrilateral ABCD
              </span>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsSeparated(!isSeparated)}
                style={{ padding: '4px 12px', fontSize: '0.9rem', fontWeight: 800 }}
              >
                {isSeparated ? "🔗 Combine" : "✂️ Separate"}
              </button>
            </div>

            {/* Stage Flat Diagram Canvas */}
            <div className="station-canvas-card">
              {!isSeparated ? (
                <svg viewBox="0 0 380 140" style={{ width: '100%', height: '135px' }}>
                  <polygon points="50,115 130,25 300,25 220,115" fill="rgba(124, 92, 191, 0.25)" stroke="#a78bfa" strokeWidth="3" />
                  
                  {/* Shared Diagonal Beam BD */}
                  <line
                    x1="130" y1="25" x2="220" y2="115"
                    stroke={commonSideMarked ? "#22c55e" : "#fbbf24"}
                    strokeWidth={commonSideMarked ? "4" : "2.5"}
                    strokeDasharray={commonSideMarked ? "0" : "5 5"}
                  />

                  {/* Hash marks on AB and CD */}
                  <line x1="85" y1="65" x2="95" y2="73" stroke="#38bdf8" strokeWidth="2.5" />
                  <line x1="255" y1="65" x2="265" y2="73" stroke="#38bdf8" strokeWidth="2.5" />

                  {/* Double Hash marks on AD and CB */}
                  <line x1="130" y1="110" x2="136" y2="120" stroke="#f472b6" strokeWidth="2.5" />
                  <line x1="138" y1="110" x2="144" y2="120" stroke="#f472b6" strokeWidth="2.5" />
                  <line x1="210" y1="20" x2="216" y2="30" stroke="#f472b6" strokeWidth="2.5" />
                  <line x1="218" y1="20" x2="224" y2="30" stroke="#f472b6" strokeWidth="2.5" />

                  <circle cx="50" cy="115" r="5" fill="#fff" />
                  <circle cx="130" cy="25" r="5" fill="#fff" />
                  <circle cx="300" cy="25" r="5" fill="#fff" />
                  <circle cx="220" cy="115" r="5" fill="#fff" />

                  <text x="35" y="125" fill="#fff" fontSize="14" fontWeight="bold">A</text>
                  <text x="125" y="18" fill="#fff" fontSize="14" fontWeight="bold">B</text>
                  <text x="310" y="24" fill="#fff" fontSize="14" fontWeight="bold">C</text>
                  <text x="225" y="128" fill="#fff" fontSize="14" fontWeight="bold">D</text>

                  {commonSideMarked && (
                    <text x="150" y="75" fill="#22c55e" fontSize="13" fontWeight="bold" transform="rotate(45, 150, 75)">
                      Common Beam BD ✓
                    </text>
                  )}
                </svg>
              ) : (
                <svg viewBox="0 0 380 140" style={{ width: '100%', height: '135px' }}>
                  {/* Left Triangle ABD */}
                  <polygon points="40,115 100,25 160,115" fill="rgba(231, 111, 81, 0.3)" stroke="#f97316" strokeWidth="3" />
                  <text x="25" y="125" fill="#fff" fontSize="13" fontWeight="bold">A</text>
                  <text x="95" y="18" fill="#fff" fontSize="13" fontWeight="bold">B</text>
                  <text x="165" y="125" fill="#fff" fontSize="13" fontWeight="bold">D</text>
                  <line x1="100" y1="25" x2="160" y2="115" stroke="#22c55e" strokeWidth="3.5" />
                  <text x="135" y="70" fill="#22c55e" fontSize="12" fontWeight="bold">BD</text>

                  {/* Right Triangle CDB */}
                  <polygon points="220,25 280,115 340,25" fill="rgba(42, 157, 143, 0.3)" stroke="#14b8a6" strokeWidth="3" />
                  <text x="205" y="22" fill="#fff" fontSize="13" fontWeight="bold">D</text>
                  <text x="275" y="130" fill="#fff" fontSize="13" fontWeight="bold">B</text>
                  <text x="345" y="22" fill="#fff" fontSize="13" fontWeight="bold">C</text>
                  <line x1="220" y1="25" x2="280" y2="115" stroke="#22c55e" strokeWidth="3.5" />
                  <text x="240" y="75" fill="#22c55e" fontSize="12" fontWeight="bold">DB</text>
                </svg>
              )}
            </div>

            {/* Clues & Proof Actions Box */}
            <div className="station-info-card">
              <div className="station-info-title">
                <span>📐</span> Stage Clues & Hidden Matches
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  className={`pin-chip ${commonSideMarked ? 'active' : ''}`}
                  onClick={() => setCommonSideMarked(true)}
                  style={{ width: '100%', justifyContent: 'center', minHeight: '32px', fontSize: '0.92rem' }}
                >
                  {commonSideMarked ? "✓ Hidden Shared Beam (BD = BD) Identified" : "🔍 Uncover Hidden Shared Beam BD"}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>
                    Congruence Test:
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['SSS', 'SAS', 'ASA', 'AAS', 'RHS'].map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`pin-chip ${selectedTest === t ? 'active' : ''}`}
                        onClick={() => setSelectedTest(t)}
                        style={{ padding: '4px 10px', minHeight: '30px', fontSize: '0.88rem' }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={`pin-chip ${henceSelected ? 'active' : ''}`}
                  onClick={() => setHenceSelected(true)}
                  style={{ width: '100%', justifyContent: 'center', minHeight: '32px', fontSize: '0.92rem' }}
                >
                  {henceSelected ? "✓ Final Deduction 'Hence, ∠A = ∠C' Added" : "🎯 Add Final Deduction 'Hence, ∠A = ∠C'"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Re-order Proof Steps & Run Audit */}
          <div className="station-col">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '10px' }}>
              <span style={{ fontSize: '1rem', color: 'var(--gold)', fontWeight: 900 }}>
                Arrange Proof Chain: Evidence ➔ Test ➔ Deduction
              </span>
            </div>

            <div className="proof-steps-list">
              {stepOrder.map((stepId, orderIdx) => {
                const step = proofSteps[stepId];
                return (
                  <div key={step.id} className="proof-step-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(255,193,7,0.2)', color: 'var(--gold)', fontWeight: 900 }}>
                        {step.badge}
                      </span>
                      <span className="proof-step-text">
                        {orderIdx + 1}. {step.text}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: '8px' }}>
                      <button
                        type="button"
                        className="stepper-btn"
                        style={{ width: '28px', height: '28px', fontSize: '0.95rem' }}
                        onClick={() => moveStep(orderIdx, -1)}
                        disabled={orderIdx === 0}
                        aria-label={`Move step ${orderIdx + 1} up`}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="stepper-btn"
                        style={{ width: '28px', height: '28px', fontSize: '0.95rem' }}
                        onClick={() => moveStep(orderIdx, 1)}
                        disabled={orderIdx === stepOrder.length - 1}
                        aria-label={`Move step ${orderIdx + 1} down`}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Run Audit Button */}
            {!completed && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={validateFullRehearsal}
                style={{ padding: '8px 20px', fontSize: '1.05rem', fontWeight: 900, width: '100%', minHeight: '36px' }}
              >
                Run Rehearsal Proof Audit 🎬
              </button>
            )}

            {/* Validation Feedback Banner */}
            {feedback && !completed && (
              <div className={`station-feedback-box ${feedback.valid ? 'test' : 'ambiguous'}`}>
                {feedback.message}
              </div>
            )}

            {/* Success Gate */}
            {completed && (
              <div className="station-success-card">
                <div className="station-success-icon">🌟</div>
                <div className="station-success-title">Full Rehearsal Approved!</div>
                <p className="station-success-desc">
                  You've constructed an airtight geometric proof: 3 matched facts ➔ SSS criterion ➔ CPCTC deduction!
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onComplete}
                  style={{ padding: '8px 24px', fontSize: '1.05rem', fontWeight: 900 }}
                >
                  Complete Station C ✓
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
