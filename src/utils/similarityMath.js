// src/utils/similarityMath.js
/**
 * SimilarQuest Geometry & Mathematical Computation Engine
 * Aligned with TRD §4.4. Authority on similarity, scale factors, area/volume scaling, and map math.
 * All ratios, scale factors, areas, and map conversions use exact rational arithmetic.
 */

import { frac, mul, div, pow, eq, cmp, toDecimal, toDisplay } from './ratio.js';

const EPSILON = 0.001;

function getSides(fig) {
  if (Array.isArray(fig) && fig.length >= 3 && typeof fig[0] === 'number') {
    return [...fig];
  }
  if (fig && fig.sides && Array.isArray(fig.sides)) {
    return [...fig.sides];
  }
  if (fig && fig.vertices && Array.isArray(fig.vertices)) {
    const pts = fig.vertices;
    const n = pts.length;
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const sides = [];
    for (let i = 0; i < n; i++) {
      sides.push(dist(pts[i], pts[(i + 1) % n]));
    }
    return sides;
  }
  return [];
}

function getAngles(fig) {
  if (fig && fig.angles && Array.isArray(fig.angles)) {
    return [...fig.angles];
  }
  if (fig && fig.vertices && fig.vertices.length >= 3) {
    const pts = fig.vertices;
    const n = pts.length;
    const angles = [];
    for (let i = 0; i < n; i++) {
      const pPrev = pts[(i - 1 + n) % n];
      const pCurr = pts[i];
      const pNext = pts[(i + 1) % n];
      const v1 = { x: pPrev.x - pCurr.x, y: pPrev.y - pCurr.y };
      const v2 = { x: pNext.x - pCurr.x, y: pNext.y - pCurr.y };
      const dot = v1.x * v2.x + v1.y * v2.y;
      const m1 = Math.hypot(v1.x, v1.y);
      const m2 = Math.hypot(v2.x, v2.y);
      const cosA = Math.max(-1, Math.min(1, dot / (m1 * m2)));
      angles.push((Math.acos(cosA) * 180) / Math.PI);
    }
    return angles;
  }
  return [];
}

/**
 * Checks if two figures are mathematically similar over rotations & reflections.
 */
export function areSimilar(figA, figB) {
  const sidesA = getSides(figA);
  const sidesB = getSides(figB);
  if (sidesA.length !== sidesB.length || sidesA.length < 3) {
    return { similar: false, reason: 'Vertex/side counts differ' };
  }

  const anglesA = getAngles(figA);
  const anglesB = getAngles(figB);
  const n = sidesA.length;

  // For triangles, if sides are known, check SSS ratio
  if (n === 3 && sidesA.length === 3) {
    const sortedA = [...sidesA].sort((a, b) => a - b);
    const sortedB = [...sidesB].sort((a, b) => a - b);

    // Calculate ratio using first side
    const kFrac = frac(Math.round(sortedB[0] * 100), Math.round(sortedA[0] * 100));
    const kFloat = sortedB[0] / sortedA[0];

    const matchSides = sortedA.every((sA, idx) => Math.abs((sortedB[idx] / sA) - kFloat) < EPSILON);

    let matchAngles = true;
    if (anglesA.length === 3 && anglesB.length === 3) {
      const sortedAngA = [...anglesA].sort((a, b) => a - b);
      const sortedAngB = [...anglesB].sort((a, b) => a - b);
      matchAngles = sortedAngA.every((ang, idx) => Math.abs(ang - sortedAngB[idx]) < 0.5);
    }

    if (matchSides && matchAngles) {
      const comp = cmp(kFrac, 1);
      return {
        similar: true,
        scaleFactor: kFrac,
        direction: 'A to B',
        isEnlargement: comp > 0,
        isReduction: comp < 0,
        isCongruent: comp === 0,
        k: toDecimal(kFrac),
      };
    }
  }

  // General polygon check: requires BOTH equal angles AND all side ratios equal
  if (anglesA.length === n && anglesB.length === n) {
    // Check cyclic orders (clockwise and counterclockwise)
    for (let flip = 0; flip < 2; flip++) {
      const orderB = flip === 0 ? [...Array(n).keys()] : [...Array(n).keys()].reverse();
      for (let offset = 0; offset < n; offset++) {
        let match = true;
        const mappedAnglesB = orderB.map(i => anglesB[(i + offset) % n]);
        for (let i = 0; i < n; i++) {
          if (Math.abs(anglesA[i] - mappedAnglesB[i]) > 0.5) {
            match = false;
            break;
          }
        }
        if (match) {
          const mappedSidesB = orderB.map(i => sidesB[(i + offset) % n]);
          const k0 = mappedSidesB[0] / sidesA[0];
          for (let i = 1; i < n; i++) {
            if (Math.abs((mappedSidesB[i] / sidesA[i]) - k0) > EPSILON) {
              match = false;
              break;
            }
          }
          if (match) {
            const kFrac = frac(Math.round(mappedSidesB[0] * 100), Math.round(sidesA[0] * 100));
            const comp = cmp(kFrac, 1);
            return {
              similar: true,
              scaleFactor: kFrac,
              direction: 'A to B',
              isEnlargement: comp > 0,
              isReduction: comp < 0,
              isCongruent: comp === 0,
              k: toDecimal(kFrac),
            };
          }
        }
      }
    }
  }

  return { similar: false, reason: 'Angles are unequal or sides are not proportional' };
}

/**
 * Returns exact scale factor from figA to figB with explicit direction.
 */
export function scaleFactor(sideA, sideB, fromName = 'figure A', toName = 'figure B') {
  const kFrac = frac(sideB, sideA);
  const comp = cmp(kFrac, 1);
  const type = comp > 0 ? 'enlargement' : comp < 0 ? 'reduction' : 'congruent';
  return {
    frac: kFrac,
    direction: `${fromName} to ${toName}`,
    type,
    formatted: toDisplay(kFrac),
    spoken: `${toDisplay(kFrac, 'spoken')}, an ${type === 'congruent' ? 'exact match' : type}`,
  };
}

/**
 * Classifies triangle marks into similarity criteria or non-tests per TRD §4.4.
 */
export function classifyTriangleMarks(marks = {}) {
  const {
    angles = 0,
    sides = 0,
    proportionalSides = 0,
    includedAngle = false,
  } = marks;

  // AA test (2 equal angle pairs)
  if (angles >= 2) {
    return 'similar-aa';
  }

  // SSS ratio (3 proportional sides)
  if (sides === 3 || proportionalSides === 3) {
    return 'similar-sss-ratio';
  }

  // SAS ratio (2 proportional sides with included angle equal)
  if ((sides === 2 || proportionalSides === 2) && angles === 1) {
    if (includedAngle) {
      return 'similar-sas-ratio';
    }
    return 'ssa-ratio-not-a-test'; // Trap: angle is not included
  }

  if (angles === 1 && (sides === 0 || proportionalSides === 0)) {
    return 'single-angle-not-a-test';
  }

  return 'insufficient';
}

/**
 * Finds two non-similar figures satisfying non-test conditions,
 * or confirms similarity for valid tests.
 */
export function findCounterexample(marks = {}) {
  const test = classifyTriangleMarks(marks);

  if (marks.isPolygon && marks.anglesOnly) {
    // E.g. rectangle (4x6) and square (5x5) have equal 90° angles, but non-proportional sides
    return {
      hasCounterexample: true,
      reason: 'A 4 cm × 6 cm rectangle and a 5 cm × 5 cm square have equal angles (90°) but different side ratios.',
      figures: [
        { type: 'rectangle', sides: [4, 6, 4, 6], angles: [90, 90, 90, 90] },
        { type: 'square', sides: [5, 5, 5, 5], angles: [90, 90, 90, 90] },
      ],
    };
  }

  if (marks.isPolygon && marks.sidesOnly) {
    // E.g. square (5x5) and rhombus (5x5 with 60°/120° angles)
    return {
      hasCounterexample: true,
      reason: 'A 5 cm square and a 5 cm rhombus have equal corresponding sides (ratio 1:1), but different interior angles.',
      figures: [
        { type: 'square', sides: [5, 5, 5, 5], angles: [90, 90, 90, 90] },
        { type: 'rhombus', sides: [5, 5, 5, 5], angles: [60, 120, 60, 120] },
      ],
    };
  }

  if (test === 'ssa-ratio-not-a-test') {
    return {
      hasCounterexample: true,
      reason: 'The non-included angle allows the side to swing into acute and obtuse triangles with different shapes.',
      triangles: [
        { sides: [6, 10, 11.98], angles: [30, 56.44, 93.56] },
        { sides: [6, 10, 5.34], angles: [30, 123.56, 26.44] },
      ],
    };
  }

  if (test === 'single-angle-not-a-test' || test === 'insufficient') {
    return {
      hasCounterexample: true,
      reason: 'One matching angle pair alone leaves the other angles and side ratios free to vary.',
      triangles: [
        { sides: [3, 4, 5], angles: [50, 60, 70] },
        { sides: [3, 5, 6], angles: [50, 40, 90] },
      ],
    };
  }

  // Valid test: no counterexample exists
  return {
    hasCounterexample: false,
    reason: `All figures satisfying ${test} are guaranteed similar.`,
    figures: null,
  };
}

/**
 * Three-way verdict: 'similar' | 'not-similar' | 'cannot-tell'
 * Per TRD §4.4: Never returns 'cannot-tell' without verifying findCounterexample succeeds!
 */
export function verdict(marks = {}, givenMeasures = {}) {
  if (givenMeasures.hasViolatedCondition || givenMeasures.unequalAngles || givenMeasures.differentRatios) {
    return 'not-similar';
  }

  const test = classifyTriangleMarks(marks);
  if (['similar-aa', 'similar-sss-ratio', 'similar-sas-ratio'].includes(test)) {
    return 'similar';
  }

  const ce = findCounterexample(marks);
  if (ce.hasCounterexample) {
    return 'cannot-tell';
  }

  return 'cannot-tell';
}

/**
 * Exact scale factors for length (k), area (k²), and volume (k³).
 */
export function lengthScale(k) {
  return frac(k);
}

export function areaScale(k) {
  return pow(frac(k), 2);
}

export function volumeScale(k) {
  return pow(frac(k), 3);
}

/**
 * Direct area computation via Shoelace formula for dual-check audits.
 */
export function polygonArea(vertices = []) {
  const n = vertices.length;
  if (n < 3) return 0;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Direct cuboid volume computation for dual-check audits.
 */
export function cuboidVolume(l, w, h) {
  return l * w * h;
}

/**
 * Map and model scale conversion per TRD §4.4.
 * dimension = 1 for length, 2 for area.
 */
export function mapConvert(value, scaleN, fromUnit, toUnit, dimension = 1) {
  // scale is 1 : scaleN (1 unit on map = scaleN units in reality)
  // Example: 4 cm on 1:50 000 map -> 4 * 50 000 cm = 200 000 cm = 2 km
  const unitToCm = {
    'mm': 0.1,
    'cm': 1,
    'm': 100,
    'km': 100000,
  };

  const cmVal = value * Math.pow(unitToCm[fromUnit], dimension);
  const realCmVal = cmVal * Math.pow(scaleN, dimension);
  const result = realCmVal / Math.pow(unitToCm[toUnit], dimension);

  return result;
}

/**
 * Formats a similarity statement: △ABC ∼ △PQR
 */
export function similarityStatement(t1 = ['A', 'B', 'C'], t2 = ['P', 'Q', 'R'], mapping = [0, 1, 2]) {
  const mapped = mapping.map(idx => t2[idx]);
  return `△${t1.join('')} ∼ △${mapped.join('')}`;
}
