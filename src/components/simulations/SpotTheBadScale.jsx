// src/components/simulations/SpotTheBadScale.jsx
import React, { useState } from 'react';
import './Stations.css';

const CASES = [
  {
    id: 1,
    title: "Case 1: The Giant Paint Spill",
    author: "Dania's Notebook",
    problem: "Real monument has surface area 200 m². Model is built at scale factor k = 1/5. Find the model's surface area.",
    steps: [
      { text: "Step 1: The scale factor from real monument to model is k = 1/5", isFlawed: false },
      { text: "Step 2: Surface area scales by linear scale factor k = 1/5", isFlawed: true, flawType: "area-scaled-by-k" },
      { text: "Step 3: Model surface area = 200 × (1/5) = 40 m²", isFlawed: false },
    ],
    flawedIdx: 1,
    explanation: "Area scales by k² = (1/5)² = 1/25, NOT linear k! The correct area is 200 ÷ 25 = 8 m².",
    fixOptions: [
      { text: "Surface area scales by k² = (1/5)² = 1/25, so area = 200 / 25 = 8 m²", correct: true },
      { text: "Surface area scales by k³ = 1/125, so area = 1.6 m²", correct: false },
      { text: "Surface area remains exactly 200 m²", correct: false },
    ],
  },
  {
    id: 2,
    title: "Case 2: The Backwards Scale Factor",
    author: "Leo's Notebook",
    problem: "Real bridge is 50 m long. The miniature model is 2 m long. State the scale factor from the real bridge to the model.",
    steps: [
      { text: "Step 1: Real bridge length = 50 m, model length = 2 m", isFlawed: false },
      { text: "Step 2: Scale factor = 50 ÷ 2 = 25, so it is an enlargement", isFlawed: true, flawType: "reversed-scale-factor" },
      { text: "Step 3: Therefore the model is 25 times bigger than the bridge", isFlawed: false },
    ],
    flawedIdx: 1,
    explanation: "Scale factor from real bridge to model is (model length) ÷ (real length) = 2 ÷ 50 = 1/25, a reduction! The direction was reversed.",
    fixOptions: [
      { text: "Scale factor = (model) ÷ (real) = 2 / 50 = 1/25, which is a reduction", correct: true },
      { text: "Scale factor is 50 - 2 = 48 m", correct: false },
      { text: "Scale factor = 2 × 50 = 100", correct: false },
    ],
  },
  {
    id: 3,
    title: "Case 3: The Additive Assumption",
    author: "Sam's Notebook",
    problem: "△ABC ∼ △PQR with AB = 6 cm and PQ = 9 cm. If BC = 10 cm, find QR.",
    steps: [
      { text: "Step 1: Compare sides AB = 6 and PQ = 9. The difference is 9 - 6 = 3 cm", isFlawed: false },
      { text: "Step 2: Since PQ is 3 cm longer than AB, QR must be 3 cm longer than BC: QR = 10 + 3 = 13 cm", isFlawed: true, flawType: "additive-reasoning" },
      { text: "Step 3: Conclude that QR = 13 cm", isFlawed: false },
    ],
    flawedIdx: 1,
    explanation: "Scale factors require MULTIPLICATIVE reasoning, never additive! PQ / AB = 9 / 6 = 1.5, so QR = 10 × 1.5 = 15 cm.",
    fixOptions: [
      { text: "Scale factor is 9 / 6 = 1.5 (multiplicative). QR = 10 × 1.5 = 15 cm", correct: true },
      { text: "Subtract 3 instead of adding: QR = 10 - 3 = 7 cm", correct: false },
      { text: "QR must equal 9 cm because PQ is 9 cm", correct: false },
    ],
  },
];

export default function SpotTheBadScale({ onComplete, audioEnabled = true }) {
  const [caseIdx, setCaseIdx] = useState(0);
  const [tappedStep, setTappedStep] = useState(null);
  const [selectedFix, setSelectedFix] = useState(null);
  const [solvedCases, setSolvedCases] = useState(new Set());
  const [feedback, setFeedback] = useState('');

  const currentCase = CASES[caseIdx];

  function handleTapStep(idx) {
    setTappedStep(idx);
    setSelectedFix(null);
    setFeedback('');
  }

  function handleSelectFix(optIdx) {
    setSelectedFix(optIdx);
    const opt = currentCase.fixOptions[optIdx];
    if (tappedStep === currentCase.flawedIdx && opt.correct) {
      const nextSet = new Set(solvedCases);
      nextSet.add(caseIdx);
      setSolvedCases(nextSet);
      setFeedback('✓ Correct! You spotted the flaw and applied the exact mathematical fix!');
    } else {
      setFeedback('❌ Not quite. Make sure you tapped the flawed step and picked the exact correction.');
    }
  }

  function handleNextCase() {
    setTappedStep(null);
    setSelectedFix(null);
    setFeedback('');
    setCaseIdx((caseIdx + 1) % CASES.length);
  }

  const isComplete = solvedCases.size >= 2;

  return (
    <div className="station-container">
      <div className="station-header">
        <div className="station-title-row">
          <span className="station-badge">Station D · Error-Detective</span>
          <h2 className="station-title">Spot the Bad Scale 🔍</h2>
        </div>
        <p className="station-instruction">
          A club member's notebook contains a seeded error! Tap the flawed step, then select the correct mathematical fix.
        </p>
      </div>

      <div className="station-workspace">
        <div className="station-grid-2col">
          {/* Left Column: Notebook Working */}
          <div className="station-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold)' }}>
                  {currentCase.title}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#a0a0b8' }}>
                  {currentCase.author}
                </span>
              </div>

              <div style={{ marginTop: '6px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '6px' }}>
                <strong>Problem:</strong> {currentCase.problem}
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--gold)', marginTop: '8px', marginBottom: '6px', fontWeight: 700 }}>
                Tap the line that contains the error:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentCase.steps.map((st, idx) => {
                  const isTapped = tappedStep === idx;
                  const isFlawedTapped = isTapped && st.isFlawed;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="btn"
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        background: isTapped
                          ? (st.isFlawed ? 'rgba(239,83,80,0.25)' : 'rgba(255,255,255,0.15)')
                          : 'rgba(255,255,255,0.04)',
                        border: isTapped
                          ? `1.5px solid ${st.isFlawed ? '#ef5350' : 'rgba(255,255,255,0.3)'}`
                          : '1px solid rgba(255,255,255,0.1)',
                        color: isTapped && st.isFlawed ? '#ff8a80' : '#fff',
                        borderRadius: '8px',
                      }}
                      onClick={() => handleTapStep(idx)}
                    >
                      <span>{st.text}</span>
                      {isTapped && (
                        <span style={{ float: 'right', fontWeight: 800, fontSize: '0.8rem' }}>
                          {st.isFlawed ? '⚠️ Flawed Step' : 'Valid Step'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {feedback && (
              <div style={{
                background: feedback.startsWith('✓') ? 'rgba(46,125,50,0.25)' : 'rgba(239,83,80,0.25)',
                border: `1px solid ${feedback.startsWith('✓') ? '#4caf50' : '#ef5350'}`,
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.82rem',
                color: feedback.startsWith('✓') ? '#81c784' : '#ef5350',
              }}>
                {feedback}
              </div>
            )}
          </div>

          {/* Right Column: Fix Selection & Controls */}
          <div className="station-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--gold)' }}>
              Choose the Correct Fix:
            </div>

            {tappedStep === null ? (
              <div style={{ color: '#a0a0b8', fontSize: '0.82rem', padding: '10px', fontStyle: 'italic' }}>
                Tap a line in the notebook first to inspect and select a fix.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentCase.fixOptions.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    type="button"
                    className={`btn ${selectedFix === optIdx ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      lineHeight: '1.3',
                    }}
                    onClick={() => handleSelectFix(optIdx)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={handleNextCase}
              >
                Next Case ➔
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#a0a0b8', marginTop: '4px' }}>
              Cases Solved: {solvedCases.size} of 2 required ({Array.from(solvedCases).map(i => `Case ${i + 1}`).join(', ') || 'none yet'})
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
              🎉 Superb Detective Work! You caught area scaling mistakes, reversed scale factors, and additive traps!
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
