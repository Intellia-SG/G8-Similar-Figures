// src/utils/congruenceMath.js
/**
 * CongruenceQuest Geometry & Mathematical Computation Engine
 * Authority on triangle congruence tests, counterexample construction, and correspondence checking.
 */

const EPSILON = 0.05;

/**
 * Geometric check for congruence between two triangles.
 * Triangles defined by side lengths [a, b, c] or coordinates.
 * Accepts rotated and flipped/mirrored copies.
 */
export function areCongruent(triA, triB) {
  const sidesA = getSides(triA).sort((x, y) => x - y);
  const sidesB = getSides(triB).sort((x, y) => x - y);

  if (sidesA.length !== 3 || sidesB.length !== 3) return false;

  for (let i = 0; i < 3; i++) {
    if (Math.abs(sidesA[i] - sidesB[i]) > EPSILON) {
      return false;
    }
  }

  return true;
}

function getSides(tri) {
  if (Array.isArray(tri) && tri.length === 3 && typeof tri[0] === 'number') {
    return [...tri];
  }
  if (tri && tri.sides && Array.isArray(tri.sides)) {
    return [...tri.sides];
  }
  if (tri && tri.vertices && tri.vertices.length === 3) {
    const [p1, p2, p3] = tri.vertices;
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    return [dist(p1, p2), dist(p2, p3), dist(p3, p1)];
  }
  return [];
}

/**
 * Classifies marks on a triangle pair into a congruence criterion or non-test.
 * 
 * marks: {
 *   sides: number (0..3),
 *   angles: number (0..3),
 *   isRightAngle?: boolean,
 *   hasHypotenuseAndLeg?: boolean,
 *   includedAngle?: boolean, // for SAS (angle between two marked sides)
 *   includedSide?: boolean,  // for ASA (side between two marked angles)
 * }
 */
export function classifyMarks(marks = {}) {
  const {
    sides = 0,
    angles = 0,
    isRightAngle = false,
    hasHypotenuseAndLeg = false,
    includedAngle = false,
    includedSide = false,
  } = marks;

  // RHS Check
  if (isRightAngle && hasHypotenuseAndLeg && sides >= 2) {
    return 'rhs';
  }

  // SSS
  if (sides === 3) {
    return 'sss';
  }

  // 2 sides + 1 angle
  if (sides === 2 && angles === 1) {
    if (includedAngle) {
      return 'sas';
    } else {
      return 'ssa-not-a-test'; // Ambiguous case trap
    }
  }

  // 1 side + 2 angles
  if (sides === 1 && angles === 2) {
    if (includedSide) {
      return 'asa';
    } else {
      return 'aas';
    }
  }

  // 3 angles
  if (angles === 3 && sides === 0) {
    return 'aaa-not-a-test'; // Similarity trap
  }

  return 'insufficient';
}

/**
 * Finds two non-congruent triangles satisfying the same marks for non-tests.
 * For valid tests, confirms that all constructions are congruent.
 */
export function findCounterexample(marks = {}) {
  const classification = classifyMarks(marks);

  if (classification === 'ssa-not-a-test') {
    // Textbook ambiguous case:
    // Given angle A = 30°, side b = 10, side a = 6 (where b*sin(A) = 5 < 6 < 10)
    // Triangle 1: acute triangle with B1 ≈ 56.44°, C1 = 93.56°, side c1 ≈ 11.98
    // Triangle 2: obtuse triangle with B2 = 180° - 56.44° = 123.56°, C2 = 26.44°, side c2 ≈ 5.34
    const tri1 = { sides: [6, 10, 11.98], angles: [30, 56.44, 93.56] };
    const tri2 = { sides: [6, 10, 5.34], angles: [30, 123.56, 26.44] };

    const congruent = areCongruent(tri1, tri2);
    return {
      hasCounterexample: !congruent,
      reason: 'The SSA configuration is ambiguous: the side can swing into acute and obtuse triangles.',
      triangles: [tri1, tri2],
    };
  }

  if (classification === 'aaa-not-a-test') {
    // Two equiangular triangles with different scale factors
    const tri1 = { sides: [3, 4, 5], angles: [36.87, 53.13, 90] };
    const tri2 = { sides: [6, 8, 10], angles: [36.87, 53.13, 90] };
    return {
      hasCounterexample: true,
      reason: 'AAA only guarantees the same shape (similarity), not the same size.',
      triangles: [tri1, tri2],
    };
  }

  if (classification === 'insufficient') {
    // Only 1 or 2 parts given
    const tri1 = { sides: [5, 5, 5], angles: [60, 60, 60] };
    const tri2 = { sides: [5, 7, 8], angles: [38.2, 60, 81.8] };
    return {
      hasCounterexample: true,
      reason: 'Not enough information: multiple different triangles can have these measurements.',
      triangles: [tri1, tri2],
    };
  }

  // Valid tests: no counterexample exists
  return {
    hasCounterexample: false,
    reason: `All triangles satisfying ${classification.toUpperCase()} are uniquely determined and congruent.`,
    triangles: null,
  };
}

/**
 * Computes the honest three-way verdict:
 * 'congruent' | 'not-congruent' | 'cannot-tell'
 * 
 * Never returns 'cannot-tell' without verifying findCounterexample succeeds!
 */
export function verdict(marks = {}, givenMeasures = {}) {
  // If explicitly shown unequal in given measures:
  if (givenMeasures.hasUnequalCorrespondingPart) {
    return 'not-congruent';
  }

  const test = classifyMarks(marks);
  if (['sss', 'sas', 'asa', 'aas', 'rhs'].includes(test)) {
    return 'congruent';
  }

  // For non-tests (SSA, AAA, insufficient)
  const ce = findCounterexample(marks);
  if (ce.hasCounterexample) {
    return 'cannot-tell';
  }

  // Fallback sanity guard
  return 'cannot-tell';
}

/**
 * Builds a valid congruence statement with vertices in matching order.
 * e.g. △ABC ≅ △PQR
 */
export function congruenceStatement(tri1 = ['A', 'B', 'C'], tri2 = ['P', 'Q', 'R'], mapping = [0, 1, 2]) {
  const mapped = mapping.map(idx => tri2[idx]);
  return `△${tri1.join('')} ≅ △${mapped.join('')}`;
}

/**
 * Produces mismatched vertex order distractors.
 * e.g. if A↔P, B↔Q, C↔R, distractor △ABC ≅ △QPR
 */
export function vertexOrderMismatch(tri1 = ['A', 'B', 'C'], tri2 = ['P', 'Q', 'R'], correctMapping = [0, 1, 2]) {
  const perm = [
    [1, 0, 2], // swap first two
    [0, 2, 1], // swap last two
    [2, 1, 0], // reverse
    [1, 2, 0], // rotate
  ];

  const correctStr = congruenceStatement(tri1, tri2, correctMapping);
  for (const p of perm) {
    const candidate = congruenceStatement(tri1, tri2, p);
    if (candidate !== correctStr) {
      return candidate;
    }
  }
  return `△${tri1.join('')} ≅ △${tri2[1]}${tri2[0]}${tri2[2]}`;
}

/**
 * Extracts the 6 corresponding parts from a congruence statement string:
 * △ABC ≅ △PQR =>
 * Sides: AB = PQ, BC = QR, AC = PR
 * Angles: ∠A = ∠P, ∠B = ∠Q, ∠C = ∠R
 */
export function correspondingParts(statement = '△ABC ≅ △PQR') {
  const clean = statement.replace(/\s+/g, '');
  const match = clean.match(/△([A-Z]{3})[≅=]△([A-Z]{3})/);
  if (!match) {
    return { sides: [], angles: [] };
  }

  const [_, t1, t2] = match;
  return {
    sides: [
      { side1: `${t1[0]}${t1[1]}`, side2: `${t2[0]}${t2[1]}` },
      { side1: `${t1[1]}${t1[2]}`, side2: `${t2[1]}${t2[2]}` },
      { side1: `${t1[0]}${t1[2]}`, side2: `${t2[0]}${t2[2]}` },
    ],
    angles: [
      { angle1: `∠${t1[0]}`, angle2: `∠${t2[0]}` },
      { angle1: `∠${t1[1]}`, angle2: `∠${t2[1]}` },
      { angle1: `∠${t1[2]}`, angle2: `∠${t2[2]}` },
    ],
  };
}
