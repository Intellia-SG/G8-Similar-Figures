// src/data/questionBank.js
/**
 * Procedural Question Bank Generator for SimilarQuest
 * Produces 100 questions (10 worlds × 10 questions).
 * Strict adherence to clean numbers, exact rational arithmetic, and misconception tracking.
 */

import { WORLDS } from '../config/worlds.config.js';
import {
  generateSimilarOrNotItem,
  generateStatementItem,
  generateScaleFactorItem,
  generateUnknownLengthItem,
  generatePolygonSimilarityItem,
  generateTriangleTestItem,
  generateHiddenTriangleItem,
  generateAreaVolumeItem,
  generateMapModelItem,
  generateMixedReviewItem,
} from '../utils/similarityProblems.js';

export const DISTRICTS = WORLDS.map(w => ({
  id: w.id,
  name: w.name,
  emoji: w.emoji,
  accent: w.accent,
  description: w.description,
  conceptFocus: w.conceptFocus,
  boss: w.boss,
}));

export function generateQuestionBank() {
  const bank = [];

  const generators = [
    generateSimilarOrNotItem,       // World 0
    generateStatementItem,          // World 1
    generateScaleFactorItem,        // World 2
    generateUnknownLengthItem,      // World 3
    generatePolygonSimilarityItem,  // World 4
    generateTriangleTestItem,       // World 5
    generateHiddenTriangleItem,     // World 6
    generateAreaVolumeItem,         // World 7
    generateMapModelItem,           // World 8
    generateMixedReviewItem,        // World 9
  ];

  for (let w = 0; w < 10; w++) {
    const gen = generators[w];
    for (let q = 0; q < 10; q++) {
      const item = gen(q);
      item.districtId = w;
      bank.push(item);
    }
  }

  return bank;
}

const questionBank = generateQuestionBank();
export default questionBank;
