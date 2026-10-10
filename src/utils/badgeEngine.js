// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for SimilarQuest (PRD §10 & TRD §7)

export const BADGES = [
  { id: 'first_win',        icon: '🧱', label: 'First Model Built',          description: 'First correct answer in the scale-model workshop!' },
  { id: 'streak_5',         icon: '📏', label: 'Steady Scaling',             description: '5-answer streak without a miscalculation!' },
  { id: 'streak_10',        icon: '🔥', label: 'Perfect Proportion Streak', description: '10-answer streak! Perfect precision on every ratio!' },
  { id: 'sim_complete',     icon: '🧰', label: 'Full Model Kit',             description: 'Completed all 4 interactive simulation stations!' },
  { id: 'three_stars',      icon: '⭐', label: 'Exhibit Ready ⭐⭐⭐',        description: 'Scored 3 stars in a Practice World!' },
  { id: 'boss_win',         icon: '🏅', label: 'Replica Approved',           description: 'Defeated a World Boss in battle!' },
  { id: 'practice_20',      icon: '🛠️', label: 'Seasoned Model Maker',       description: 'Answered over 20 questions in Practice!' },
  { id: 'journey_complete', icon: '🏆', label: 'Master Model Maker Badge',   description: 'Completed the full 5-phase SimilarQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_win');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('streak_5');
  if (state.maxStreak >= 10) unlocked.push('streak_10');

  // Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('sim_complete');
  }

  // 3-star district check (9 or 10 correct = 3 stars)
  if (state.districtScores && state.districtScores.some(score => score !== null && score >= 9)) {
    unlocked.push('three_stars');
  }

  // Seasoned model maker (20+ questions)
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('practice_20');
  }

  // Boss slayer
  if (state.bossDefeated) {
    unlocked.push('boss_win');
  }

  // Full journey
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('journey_complete');
  }

  return unlocked;
}
