// src/utils/geoFacts.js
/**
 * SimilarQuest Geometric Facts & Chain Validator
 * Implements Fact model, closure derivation, chain checking, and valid ordering computation.
 * Aligned with TRD §4.4.
 */

import { REASONS, REASON_DISPLAY } from './geoReasons.js';

export class Fact {
  constructor({ type, subject, value, reason = 'given', provenance = [], correspondence = null }) {
    this.type = type; // 'side-ratio', 'angle-equal', 'similarity', 'deduced-length', 'area-ratio', 'volume-ratio'
    this.subject = subject; // e.g. 'AB/PQ = 3/2' or '△ABC ∼ △PQR'
    this.value = value;
    this.reason = reason;
    this.provenance = provenance;
    this.correspondence = correspondence;
  }

  key() {
    return `${this.type}:${this.subject}`;
  }
}

/**
 * Derives geometric closure from givens by applying deduction rules
 */
export function deriveClosure(givens = []) {
  const factsMap = new Map();
  givens.forEach(f => factsMap.set(f.key ? f.key() : `${f.type}:${f.subject}`, f));

  let changed = true;
  let iterations = 0;

  while (changed && iterations < 10) {
    changed = false;
    iterations++;

    // If similarity fact already exists, derive corresponding side ratios and equal angles
    const simFacts = Array.from(factsMap.values()).filter(f => f.type === 'similarity');
    for (const sim of simFacts) {
      if (sim.correspondence) {
        const { t1, t2 } = sim.correspondence;
        // Sides proportional
        const sides = [
          [`${t1[0]}${t1[1]}`, `${t2[0]}${t2[1]}`],
          [`${t1[1]}${t1[2]}`, `${t2[1]}${t2[2]}`],
          [`${t1[0]}${t1[2]}`, `${t2[0]}${t2[2]}`],
        ];
        for (const [s1, s2] of sides) {
          const k = `deduced-ratio:${s1}/${s2}`;
          if (!factsMap.has(k)) {
            factsMap.set(k, new Fact({
              type: 'deduced-ratio',
              subject: `${s1}/${s2}=k`,
              reason: 'corresponding-sides-proportional',
              provenance: [sim.key ? sim.key() : 'similarity'],
            }));
            changed = true;
          }
        }
        // Angles equal
        const angles = [
          [`∠${t1[0]}`, `∠${t2[0]}`],
          [`∠${t1[1]}`, `∠${t2[1]}`],
          [`∠${t1[2]}`, `∠${t2[2]}`],
        ];
        for (const [a1, a2] of angles) {
          const k = `deduced-angle:${a1}=${a2}`;
          if (!factsMap.has(k)) {
            factsMap.set(k, new Fact({
              type: 'angle-equal',
              subject: `${a1}=${a2}`,
              reason: 'corresponding-angles-equal-similar-triangles',
              provenance: [sim.key ? sim.key() : 'similarity'],
            }));
            changed = true;
          }
        }
      }
    }
  }

  return Array.from(factsMap.values());
}

/**
 * Validates a multi-step proof chain for similarity and deductions.
 * Authority on geometric validity per TRD §4.4.
 * 
 * Returns: { valid: boolean, failsAtStep: number | null, failureType: string | null, reason: string | null }
 */
export function checkChain(chain = [], givens = []) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return { valid: false, failsAtStep: 0, failureType: 'empty-chain', reason: 'Proof chain is empty' };
  }

  const establishedFacts = new Set();
  const provenSimilarTriangles = new Set(); // store pairs of similar triangles proven so far

  // Register givens
  for (const g of givens) {
    const s = typeof g === 'string' ? g : g.subject;
    establishedFacts.add(s);
    if (g.type === 'side-equal' || g.type === 'common-side') establishedFacts.add(`side:${s}`);
    if (g.type === 'angle-equal' || g.type === 'common-angle') establishedFacts.add(`angle:${s}`);
    if (g.type === 'side-ratio') establishedFacts.add(`ratio:${s}`);
  }

  for (let stepIdx = 0; stepIdx < chain.length; stepIdx++) {
    const step = chain[stepIdx];
    const { statement, reason, type, test, tri1, tri2, correspondence, flaw } = step;

    // Direct check for intentional seeded flaws in simulations/tests
    if (flaw) {
      return {
        valid: false,
        failsAtStep: stepIdx,
        failureType: flaw.type || 'seeded-flaw',
        reason: flaw.description || 'Seeded error in proof step',
      };
    }

    // 1. Unknown Reason Check
    if (reason && !REASONS.includes(reason) && !REASON_DISPLAY[reason]) {
      return {
        valid: false,
        failsAtStep: stepIdx,
        failureType: 'unknown-reason',
        reason: `Reason "${reason}" is not a recognized geometric reason`,
      };
    }

    // 2. Non-corresponding sides compared
    if (step.nonCorrespondingSides || step.comparedNonCorresponding) {
      return {
        valid: false,
        failsAtStep: stepIdx,
        failureType: 'non-corresponding-sides-compared',
        reason: 'Sides being compared are not corresponding positions in the two figures',
      };
    }

    // 3. Part vs Whole side error (e.g., AD compared to DB instead of AB)
    if (step.partVsWhole) {
      return {
        valid: false,
        failsAtStep: stepIdx,
        failureType: 'part-vs-whole-side',
        reason: 'Comparing a segment part (DB) instead of the whole triangle side (AB)',
      };
    }

    // 4. Ratio before similarity check
    if (reason === 'corresponding-sides-proportional' || reason === 'scale-factor-definition' || type === 'ratio-deduction') {
      const pairKey = `${tri1 || 'T1'}&${tri2 || 'T2'}`;
      if (!provenSimilarTriangles.has(pairKey) && !provenSimilarTriangles.size && !step.similarityEstablished) {
        return {
          valid: false,
          failsAtStep: stepIdx,
          failureType: 'ratio-before-similarity',
          reason: 'Cannot use ratio of corresponding sides before triangles are proven similar',
        };
      }
    }

    // 5. Similarity Test step checks
    if (['similar-aa', 'similar-sss-ratio', 'similar-sas-ratio'].includes(reason) || type === 'similarity') {
      // Check for statement order mismatch
      if (correspondence && correspondence.isWrongOrder) {
        return {
          valid: false,
          failsAtStep: stepIdx,
          failureType: 'statement-order-mismatch',
          reason: `Vertex correspondence does not match equal parts: ${statement}`,
        };
      }

      // Check test position validity
      if (step.testPositionInvalid || (step.usedTest === 'similar-sas-ratio' && step.angleIsIncluded === false)) {
        return {
          valid: false,
          failsAtStep: stepIdx,
          failureType: 'test-positions-wrong',
          reason: 'The marked angle is not between the two proportional sides',
        };
      }

      if (step.ratiosUnequal) {
        return {
          valid: false,
          failsAtStep: stepIdx,
          failureType: 'condition-not-met',
          reason: 'The side pairs are not in the same ratio',
        };
      }

      // Test passed, register proven similarity
      const pairKey = `${tri1 || 'T1'}&${tri2 || 'T2'}`;
      provenSimilarTriangles.add(pairKey);
      establishedFacts.add(statement);
      continue;
    }

    // 6. Area / volume scale deductions
    if (reason === 'area-scale-factor' || reason === 'volume-scale-factor' || type === 'area-volume-deduction') {
      if (step.scaledByLinearK) {
        return {
          valid: false,
          failsAtStep: stepIdx,
          failureType: 'area-scaled-by-k',
          reason: 'Area must scale by k² (or volume by k³), not linear scale factor k',
        };
      }
    }

    // Add established facts
    if (statement) {
      establishedFacts.add(statement);
    }
  }

  return { valid: true, failsAtStep: null, failureType: null, reason: 'Valid argument chain' };
}

/**
 * Computes whether a permutation of steps represents a mathematically valid ordering.
 * A valid ordering must satisfy:
 * 1. The premise facts (angles equal or sides proportional) must come BEFORE the similarity test conclusion.
 * 2. The similarity test conclusion must come BEFORE any scale factor, missing length, or area ratio deduction.
 */
export function validOrderings(steps = []) {
  if (!Array.isArray(steps) || steps.length === 0) return false;

  const testIndex = steps.findIndex(
    s => s.type === 'similarity' || ['similar-aa', 'similar-sss-ratio', 'similar-sas-ratio'].includes(s.reason)
  );

  const deductionIndices = steps
    .map((s, idx) => ((s.type === 'deduction' || s.reason === 'corresponding-sides-proportional' || s.reason === 'area-scale-factor' || s.reason === 'scale-factor-definition') ? idx : -1))
    .filter(idx => idx !== -1);

  const premiseIndices = steps
    .map((s, idx) => (s.type === 'premise' || s.type === 'fact' ? idx : -1))
    .filter(idx => idx !== -1);

  // If there is a similarity test, all premises must appear before it
  if (testIndex !== -1) {
    for (const pIdx of premiseIndices) {
      if (pIdx > testIndex) return false;
    }
  }

  // All deductions must appear after the similarity test
  for (const dIdx of deductionIndices) {
    if (testIndex !== -1 && dIdx < testIndex) return false;
  }

  return true;
}
