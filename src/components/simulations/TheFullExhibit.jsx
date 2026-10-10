// src/components/simulations/TheFullExhibit.jsx
import React, { useState } from 'react';
import './Stations.css';
import { checkChain } from '../../utils/geoFacts.js';

export default function TheFullExhibit({ onComplete, audioEnabled = true }) {
  const [step, setStep] = useState(1);
  const [separated, setSeparated] = useState(false);
  const [angleReason, setAngleReason] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [statement, setStatement] = useState('');
  const [unknownLength, setUnknownLength] = useState('');
  const [areaRatio, setAreaRatio] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Values: AD = 4, DB = 8 (so whole side AB = 12), DE = 5, Area △ADE = 10
  // Scale factor k = 12 / 4 = 3
  // BC = 5 * 3 = 15
  // Area ratio = 3² = 9

  function handleSeparate() {
    setSeparated(true);
    setErrorMsg('');
  }

  function handleAngleSubmit() {
    if (angleReason !== 'corresponding-angles-parallel') {
      setErrorMsg('Incorrect reason! DE ∥ BC gives corresponding angles across transversal AB.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  }

  function handleTestSubmit() {
    if (selectedTest !== 'similar-aa') {
      setErrorMsg('Incorrect test! Two pairs of equal angles (common ∠A and corr. ∠s) prove similarity via (AA).');
      return;
    }
    setErrorMsg('');
    setStep(3);
  }

  function handleStatementSubmit() {
    if (statement !== '△ADE ∼ △ABC') {
      setErrorMsg('Vertex order mismatch! A matches A, D matches B, and E matches C.');
      return;
    }
    setErrorMsg('');
    setStep(4);
  }

  function handleValuesSubmit() {
    if (unknownLength !== '15') {
      setErrorMsg('Incorrect length for BC! Scale factor is AB / AD = 12 / 4 = 3, so BC = 5 × 3 = 15 cm.');
      return;
    }
    if (areaRatio !== '9') {
      setErrorMsg('Incorrect area ratio! Area scales by k² = 3² = 9 (not linear 3).');
      return;
    }
    setErrorMsg('');
    setStep(5);
  }

  const isComplete = step === 5;

  return (
    <div className="station-container">
      <div className="station-header">
        <div className="station-title-row">
          <span className="station-badge">Station C · Multi-Step Construction</span>
          <h2 className="station-title">The Full Exhibit 🏛️</h2>
        </div>
        <p className="station-instruction">
          Construct a complete geometric proof and scale deduction on an embedded figure step by step!
        </p>
      </div>

      <div className="station-workspace">
        <div className="station-grid-2col">
          {/* Left Column: Interactive Diagram */}
          <div className="station-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(10, 15, 35, 0.85)',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '4px' }}>
                Exhibit Figure: DE ∥ BC with D on AB, E on AC
              </div>

              {!separated ? (
                <svg viewBox="0 0 240 150" style={{ width: '85%', height: '140px' }}>
                  <polygon points="120,20 30,135 210,135" fill="rgba(77,144,142,0.18)" stroke="#4D908E" strokeWidth="2.5" />
                  <line x1="68" y1="86" x2="172" y2="86" stroke="#F9C74F" strokeWidth="2.5" strokeDasharray="4 2" />
                  <polygon points="120,20 68,86 172,86" fill="rgba(249,199,79,0.25)" stroke="#F9C74F" strokeWidth="2" />
                  <text x="120" y="15" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">A</text>
                  <text x="20" y="140" fill="#fff" fontSize="10" fontWeight="700">B</text>
                  <text x="215" y="140" fill="#fff" fontSize="10" fontWeight="700">C</text>
                  <text x="50" y="88" fill="#F9C74F" fontSize="10" fontWeight="700">D</text>
                  <text x="180" y="88" fill="#F9C74F" fontSize="10" fontWeight="700">E</text>
                  <text x="75" y="50" fill="#ffe082" fontSize="9">AD = 4</text>
                  <text x="35" y="112" fill="#ffe082" fontSize="9">DB = 8 (AB = 12)</text>
                  <text x="120" y="81" fill="#F9C74F" fontSize="9" textAnchor="middle">DE = 5</text>
                  <text x="120" y="148" fill="#4D908E" fontSize="9" textAnchor="middle">BC = ?</text>
                </svg>
              ) : (
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '10px 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#F9C74F', fontWeight: 700 }}>△ADE (Model)</div>
                    <svg viewBox="0 0 90 80" style={{ width: '90px', height: '70px' }}>
                      <polygon points="45,10 10,70 80,70" fill="rgba(249,199,79,0.25)" stroke="#F9C74F" strokeWidth="2" />
                      <text x="45" y="8" fill="#fff" fontSize="8" textAnchor="middle">A</text>
                      <text x="6" y="75" fill="#fff" fontSize="8">D</text>
                      <text x="82" y="75" fill="#fff" fontSize="8">E</text>
                      <text x="15" y="40" fill="#ffe082" fontSize="8">4</text>
                      <text x="45" y="67" fill="#ffe082" fontSize="8" textAnchor="middle">5</text>
                    </svg>
                  </div>
                  <div style={{ color: 'var(--gold)', fontWeight: 800 }}>∼</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#4D908E', fontWeight: 700 }}>△ABC (Original)</div>
                    <svg viewBox="0 0 120 100" style={{ width: '120px', height: '90px' }}>
                      <polygon points="60,10 15,90 105,90" fill="rgba(77,144,142,0.25)" stroke="#4D908E" strokeWidth="2" />
                      <text x="60" y="8" fill="#fff" fontSize="8" textAnchor="middle">A</text>
                      <text x="8" y="96" fill="#fff" fontSize="8">B</text>
                      <text x="110" y="96" fill="#fff" fontSize="8">C</text>
                      <text x="25" y="50" fill="#4D908E" fontSize="8">12</text>
                      <text x="60" y="87" fill="#4D908E" fontSize="8" textAnchor="middle">BC = {unknownLength || '?'}</text>
                    </svg>
                  </div>
                </div>
              )}

              {!separated && (
                <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: '6px' }} onClick={handleSeparate}>
                  Separate Overlapping Triangles 🔍
                </button>
              )}
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239,83,80,0.2)', border: '1px solid #ef5350', borderRadius: '8px', padding: '6px 12px', color: '#ef5350', fontSize: '0.8rem', width: '100%' }}>
                {errorMsg}
              </div>
            )}
          </div>

          {/* Right Column: Multi-Step Proof Builder */}
          <div className="station-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: '#a0a0b8' }}>
              Proof Step {step} of 4:
            </div>

            {/* Step 1: Angle Reasons */}
            {step === 1 && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
                  1. Why is ∠ADE equal to ∠ABC?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { label: "Corresponding angles (DE ∥ BC)", key: "corresponding-angles-parallel" },
                    { label: "Alternate angles (DE ∥ BC)", key: "alternate-angles-parallel" },
                    { label: "Vertically opposite angles", key: "vertically-opposite-angles" },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`btn btn-sm ${angleReason === opt.key ? 'btn-primary' : 'btn-outline'}`}
                      style={{ textAlign: 'left' }}
                      onClick={() => setAngleReason(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '8px', width: '100%' }} onClick={handleAngleSubmit} disabled={!angleReason}>
                  Confirm Angle Reason ➔
                </button>
              </div>
            )}

            {/* Step 2: Test Selection */}
            {step === 2 && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
                  2. With common ∠A and ∠ADE = ∠ABC, which similarity test applies?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { label: "Angle-Angle criterion (AA)", key: "similar-aa" },
                    { label: "Three proportional sides (SSS ratio)", key: "similar-sss-ratio" },
                    { label: "Side-Angle-Side criterion (SAS ratio)", key: "similar-sas-ratio" },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`btn btn-sm ${selectedTest === opt.key ? 'btn-primary' : 'btn-outline'}`}
                      style={{ textAlign: 'left' }}
                      onClick={() => setSelectedTest(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '8px', width: '100%' }} onClick={handleTestSubmit} disabled={!selectedTest}>
                  Confirm Similarity Test ➔
                </button>
              </div>
            )}

            {/* Step 3: Similarity Statement */}
            {step === 3 && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
                  3. Select the statement with vertices in matching order:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    "△ADE ∼ △ABC",
                    "△ADE ∼ △BAC",
                    "△ADE ∼ △CBA",
                  ].map(stmt => (
                    <button
                      key={stmt}
                      type="button"
                      className={`btn btn-sm ${statement === stmt ? 'btn-primary' : 'btn-outline'}`}
                      style={{ textAlign: 'left' }}
                      onClick={() => setStatement(stmt)}
                    >
                      {stmt}
                    </button>
                  ))}
                </div>
                <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '8px', width: '100%' }} onClick={handleStatementSubmit} disabled={!statement}>
                  Confirm Statement ➔
                </button>
              </div>
            )}

            {/* Step 4: Unknown Length & Area Ratio */}
            {step === 4 && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: '8px' }}>
                  4. Deduce Unknown Length BC and Area Ratio:
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a0a0b8' }}>
                    Length of BC (AD = 4, AB = 12, DE = 5):
                  </label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {['12', '15', '13'].map(val => (
                      <button
                        key={val}
                        type="button"
                        className={`btn btn-sm ${unknownLength === val ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1 }}
                        onClick={() => setUnknownLength(val)}
                      >
                        {val} cm
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#a0a0b8' }}>
                    Ratio of Area (△ABC) to Area (△ADE) [k = 3]:
                  </label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {['3', '6', '9'].map(val => (
                      <button
                        key={val}
                        type="button"
                        className={`btn btn-sm ${areaRatio === val ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1 }}
                        onClick={() => setAreaRatio(val)}
                      >
                        {val}×
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '10px', width: '100%' }} onClick={handleValuesSubmit} disabled={!unknownLength || !areaRatio}>
                  Submit Deductions ✓
                </button>
              </div>
            )}

            {/* Step 5: Finished Summary */}
            {step === 5 && (
              <div style={{ background: 'rgba(77,144,142,0.15)', border: '1px solid #4D908E', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '4px' }}>
                  Complete Watertight Proof:
                </div>
                <ol style={{ fontSize: '0.8rem', lineHeight: '1.4', paddingLeft: '18px', margin: 0 }}>
                  <li>∠A is common angle; ∠ADE = ∠ABC (corr. ∠s, // lines)</li>
                  <li>∴ △ADE ∼ △ABC (AA similarity criterion)</li>
                  <li>Scale factor k = AB / AD = 12 / 4 = 3</li>
                  <li>Hence BC = DE × 3 = 15 cm (corr. sides of ∼ △s)</li>
                  <li>Area ratio = k² = 3² = 9 (area scales by k²)</li>
                </ol>
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
              🎉 Masterpiece! You proved triangle similarity, separated overlapping parts, and computed lengths and area ratios!
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
