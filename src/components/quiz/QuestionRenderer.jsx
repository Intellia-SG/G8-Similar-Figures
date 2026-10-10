// src/components/quiz/QuestionRenderer.jsx
import React, { useState, useEffect } from 'react';
import './QuestionRenderer.css';
import SimilarityVisual from '../shared/SimilarityVisual.jsx';

export default function QuestionRenderer({
  question,
  onAnswer,
  hintsShown,
  showHint,
  onHint,
  isLocked,
  onPrev,
  onNext,
  canPrev,
}) {
  const [orderedSteps, setOrderedSteps] = useState([]);
  const isOrderingMode = question?.questionText?.toLowerCase().includes('order') && question?.options?.length >= 3 && question?.options[0]?.includes('1.');

  useEffect(() => {
    if (isOrderingMode && question?.options) {
      setOrderedSteps([...question.options]);
    }
  }, [question?.id, isOrderingMode, question?.options]);

  if (!question) return null;

  const { category, questionText, options, visual, visualData, hint1, hint2 } = question;
  const categoryTag = category || 'SIMILAR FIGURES';

  function moveStep(idx, direction) {
    if (isLocked) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= orderedSteps.length) return;
    const nextSteps = [...orderedSteps];
    const temp = nextSteps[idx];
    nextSteps[idx] = nextSteps[targetIdx];
    nextSteps[targetIdx] = temp;
    setOrderedSteps(nextSteps);
  }

  function submitOrderedSteps() {
    const combined = orderedSteps.join(' ➔ ');
    onAnswer(combined);
  }

  // Detect Three-Way Verdict buttons or longer rational / explanation choices
  const isVerdictMode = options?.some(opt =>
    opt.toLowerCase().startsWith('similar') ||
    opt.toLowerCase().startsWith('not similar') ||
    opt.toLowerCase().startsWith('cannot tell') ||
    opt.toLowerCase().startsWith('no —') ||
    opt.toLowerCase().startsWith('yes —') ||
    opt.toLowerCase().startsWith('no,') ||
    opt.toLowerCase().startsWith('yes,') ||
    opt.length > 35
  );

  return (
    <div className="qr-wrap glass-card anim-slide-up">
      {/* Top category badge tag */}
      <div className="qr-category-badge">
        <span className="cat-icon">📐</span> {categoryTag}
      </div>

      {/* Question text */}
      <p className="qr-question">{questionText}</p>

      {/* Visual aid if available */}
      {visual && (
        <div className="qr-visual">
          <SimilarityVisual type={visual} data={visualData || {}} compact={true} />
        </div>
      )}

      {/* Interactive Step Ordering Answer Mode */}
      {isOrderingMode ? (
        <div className="qr-ordering-container" style={{ margin: '10px 0', width: '100%' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--gold)', marginBottom: '8px', textAlign: 'center' }}>
            Use the arrows to arrange the steps into valid logical order, then click Submit:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orderedSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{step}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 8px', minWidth: '32px' }}
                    onClick={() => moveStep(idx, -1)}
                    disabled={idx === 0 || isLocked}
                    aria-label={`Move step ${idx + 1} up`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 8px', minWidth: '32px' }}
                    onClick={() => moveStep(idx, 1)}
                    disabled={idx === orderedSteps.length - 1 || isLocked}
                    aria-label={`Move step ${idx + 1} down`}
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ marginTop: '12px', width: '100%' }}
            onClick={submitOrderedSteps}
            disabled={isLocked}
          >
            Submit Arranged Steps ✓
          </button>
        </div>
      ) : (
        /* Options grid (MCQ or Verdict / Long format) */
        <div className={isVerdictMode ? "options-vertical" : "options-grid"}>
          {options?.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${isVerdictMode ? 'verdict-option' : ''}`}
              onClick={() => !isLocked && onAnswer(opt)}
              disabled={isLocked}
              aria-label={`Option: ${opt}`}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hint display */}
      {showHint === 1 && hint1 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">💡</span>
          <span>{hint1}</span>
        </div>
      )}
      {showHint === 2 && hint2 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">🔑</span>
          <span>{hint2}</span>
        </div>
      )}

      {/* Bottom Action Row: Hint Button + Prev + Next in one sleek bar */}
      <div className="qr-actions-row">
        {hintsShown < 2 && onHint ? (
          <button className="btn btn-outline btn-sm hint-btn" onClick={onHint} aria-label="Show hint">
            💡 Hint {hintsShown + 1}
          </button>
        ) : <div />}

        <div className="qr-nav-btns">
          {onPrev && (
            <button
              className="btn btn-outline btn-sm qr-nav-btn"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous question"
            >
              ← Prev Question
            </button>
          )}
          {onNext && (
            <button
              className="btn btn-primary btn-sm qr-nav-btn"
              onClick={onNext}
              aria-label="Next question"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
