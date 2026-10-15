// src/components/IntroScreen.jsx
import React, { useEffect } from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';
import { useAudio } from '../hooks/useAudio.js';
import { introNarration } from '../utils/narration.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'Statue paint mystery' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Dania & Kabir\'s exhibition' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 scale labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 worlds & bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Review & scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  useEffect(() => {
    if (state?.audioEnabled) {
      const timer = setTimeout(() => narrate(introNarration()), 600);
      return () => { clearTimeout(timer); stopAll(); };
    }
    return () => stopAll();
  }, [state?.audioEnabled, narrate, stopAll]);

  function playGreeting() {
    stopAll();
    narrate(introNarration());
  }

  function startFresh() {
    stopAll();
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    stopAll();
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  function handleSelectPhase(phase) {
    stopAll();
    dispatch({ type: 'SET_PHASE', payload: phase });
  }

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Grade 8 Curriculum · Similar Figures &amp; Scale Factors
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Similar</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">SimilarQuest · Master Scale Factors, Triangle Tests &amp; Model Scaling</h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle" onClick={playGreeting} title="Click to listen to Otto!" style={{ cursor: 'pointer' }}>
          🦦
        </div>
        <div className="intro-speech-bubble">
          Hi! I'm Otto the Otter. Ready to join Dania and Kabir at the scale-model exhibition hall,<br />
          find scale factors, test similarity, and discover why double length means four times the paint? 🦦📏
          <button
            type="button"
            className="intro-listen-btn"
            onClick={playGreeting}
            aria-label="Listen to narration"
            title="Listen to Otto"
            style={{
              marginLeft: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.05rem',
              verticalAlign: 'middle',
            }}
          >
            🔊
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn what it means for figures to have the same shape at different sizes, write exact similarity statements, find scale factors with direction, test polygons and triangles (AA, SSS ratio, SAS ratio), separate hidden triangles, and scale areas (k²) and volumes (k³)!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>

        <div className="journey-steps-container">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-item clickable-step"
                onClick={() => handleSelectPhase(j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase())}
                role="button"
                tabIndex={0}
                title={`Click to open ${j.label} phase`}
              >
                <span className="journey-icon-circle">{j.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">{j.desc}</span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="intro-ctas">
        <button className="btn btn-primary btn-lg intro-cta-main" onClick={startFresh}>
          🚀 Enter the Model Exhibition!
        </button>
        {hasSaved && (
          <button className="btn btn-outline" onClick={resumeSession} style={{ marginTop: '10px' }}>
            ↩ Resume Session
          </button>
        )}
      </div>

      {/* Bottom Cards */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#ff6b6b' }}>🎯</div>
          <div>100 Questions</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#feca57' }}>📐</div>
          <div>3 Triangle Tests</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#66bb6a' }}>🧊</div>
          <div>k, k², k³ Scaling</div>
        </div>
      </div>
    </div>
  );
}
