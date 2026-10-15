// src/utils/similarityProblems.js
/**
 * Procedural Problem & Distractor Generators for SimilarQuest
 * Aligned with TRD §4.4 & PRD §9.
 * Enforces clean numbers, exact rational arithmetic, and verified misconceptions.
 */

import { frac, mul, div, pow, eq, cmp, toDecimal, toDisplay } from './ratio.js';
import { areSimilar, scaleFactor, classifyTriangleMarks, verdict, lengthScale, areaScale, volumeScale, mapConvert } from './similarityMath.js';
import { embeddedFigure } from './similarityDiagram.js';

export const misconceptions = {
  areaScaledByK: (area, k) => Math.round(area * toDecimal(k)),
  volumeScaledByK: (vol, k) => Math.round(vol * toDecimal(k)),
  volumeScaledByKSquared: (vol, k) => Math.round(vol * Math.pow(toDecimal(k), 2)),
  perimeterScaledByKSquared: (perim, k) => Math.round(perim * Math.pow(toDecimal(k), 2)),
  additiveInsteadOfMultiplicative: (s1, s2, target) => {
    const diff = s2 - s1;
    return target + diff;
  },
  reversedScaleFactor: (k) => frac(frac(k).d, frac(k).n),
  partVsWholeSide: (whole, part) => whole - part,
  mapUnitSlip: (correct, factor = 10) => correct * factor,
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

/**
 * Ensures strictly unique 4 options. If any distractors collide, replaces with safe fallback.
 */
function makeFourOptions(correct, distractors, fallbackGen) {
  const set = new Set([correct]);
  const result = [correct];

  for (const d of distractors) {
    if (d && !set.has(d)) {
      set.add(d);
      result.push(d);
      if (result.length === 4) break;
    }
  }

  let counter = 1;
  while (result.length < 4) {
    const fb = fallbackGen ? fallbackGen(counter) : `Option ${counter}`;
    if (!set.has(fb)) {
      set.add(fb);
      result.push(fb);
    }
    counter++;
  }

  return shuffle(result);
}

/**
 * World 0: Same Shape, Different Size (`similar-vs-congruent-figures`)
 */
export function generateSimilarOrNotItem(id) {
  const isSimilar = Math.random() > 0.5;
  const k = pick([frac(2, 1), frac(3, 1), frac(3, 2)]);
  const w1 = pick([4, 6, 8]);
  const h1 = pick([6, 8, 10]);

  let w2, h2;
  if (isSimilar) {
    w2 = Math.round(w1 * toDecimal(k));
    h2 = Math.round(h1 * toDecimal(k));
  } else {
    w2 = Math.round(w1 * toDecimal(k));
    h2 = Math.round(h1 * toDecimal(k)) + pick([2, 3]);
  }

  const questionText = `Rectangle A has dimensions ${w1} cm × ${h1} cm. Rectangle B has dimensions ${w2} cm × ${h2} cm. Are the two rectangles similar?`;
  const correctAnswer = isSimilar
    ? `Yes — both corresponding side pairs are in the exact ratio ${toDisplay(k)}, and all angles are 90°`
    : `No — the side ratios ${w2}/${w1} and ${h2}/${h1} are not equal, even though all angles are 90°`;

  const distractor1 = isSimilar
    ? `No — they are different sizes, so they cannot be similar`
    : `Yes — all angles are 90°, so equal angles guarantee similarity`;

  const distractor2 = isSimilar
    ? `Only if their areas are also in the ratio ${toDisplay(k)}`
    : `Yes — the sides differ by an added amount, so they must be similar`;

  const distractor3 = `Cannot tell without measuring the diagonals`;

  const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3]);

  return {
    id: `w0_q${id}`,
    districtId: 0,
    category: "SIMILAR FIGURES",
    visual: "figure-pair",
    questionText,
    options,
    correctAnswer,
    explanation: isSimilar
      ? `Two figures are similar when corresponding angles are equal AND corresponding sides are proportional (${w2}/${w1} = ${h2}/${h1} = ${toDisplay(k)}).`
      : `Equal angles alone do NOT prove similarity for polygons. Side ratios must be identical (${w2}/${w1} ≠ ${h2}/${h1}).`,
    hint1: "Check if width and height scale by the exact same multiplier.",
    hint2: "Divide the matching sides to see if both ratios are equal.",
    visualData: {
      figA: { type: 'rectangle', w: w1, h: h1, label: 'Rectangle A' },
      figB: { type: 'rectangle', w: w2, h: h2, label: 'Rectangle B' },
      isSimilar,
    },
  };
}

/**
 * World 1: Matching Sides and Angles (`corresponding-parts-and-similarity-statements`)
 */
export function generateStatementItem(id) {
  const perm = pick([
    ['P', 'Q', 'R'],
    ['Q', 'R', 'P'],
    ['R', 'P', 'Q'],
    ['Q', 'P', 'R'],
  ]);

  const statement = `△ABC ∼ △${perm.join('')}`;
  const sideAsk = pick([
    { s1: 'AB', s2: `${perm[0]}${perm[1]}` },
    { s1: 'BC', s2: `${perm[1]}${perm[2]}` },
    { s1: 'AC', s2: `${perm[0]}${perm[2]}` },
  ]);

  const questionText = `Given the similarity statement ${statement}, which side in the second triangle corresponds to side ${sideAsk.s1}?`;
  const correctAnswer = sideAsk.s2;

  const otherSides = [
    `${perm[0]}${perm[1]}`,
    `${perm[1]}${perm[2]}`,
    `${perm[0]}${perm[2]}`,
    `${perm[2]}${perm[1]}`,
    `${perm[1]}${perm[0]}`,
  ];

  const options = makeFourOptions(
    correctAnswer,
    otherSides.filter(s => s !== correctAnswer),
    (c) => `Side ${c}`
  );

  return {
    id: `w1_q${id}`,
    districtId: 1,
    category: "CORRESPONDING PARTS",
    visual: "correspondence-table",
    questionText,
    options,
    correctAnswer,
    explanation: `In the similarity statement ${statement}, the position of each letter defines the matching parts: A↔${perm[0]}, B↔${perm[1]}, and C↔${perm[2]}. Therefore, ${sideAsk.s1} corresponds to ${sideAsk.s2}.`,
    hint1: "The order of vertices in the similarity statement fixes the exact match.",
    hint2: `Find the positions of letters ${sideAsk.s1[0]} and ${sideAsk.s1[1]} in the second triangle name.`,
    visualData: {
      statement,
      t1: ['A', 'B', 'C'],
      t2: perm,
    },
  };
}

/**
 * World 2: Find the Scale Factor (`find-scale-factor`)
 * Curated integer pairs (sA, sB) to avoid raw float decimals
 */
const SCALE_FACTOR_PAIRS = [
  { sA: 6, sB: 15, k: frac(5, 2) },
  { sA: 4, sB: 6,  k: frac(3, 2) },
  { sA: 6, sB: 4,  k: frac(2, 3) },
  { sA: 10, sB: 4, k: frac(2, 5) },
  { sA: 4, sB: 8,  k: frac(2, 1) },
  { sA: 6, sB: 18, k: frac(3, 1) },
  { sA: 10, sB: 5, k: frac(1, 2) },
  { sA: 12, sB: 4, k: frac(1, 3) },
];

export function generateScaleFactorItem(id) {
  const pair = pick(SCALE_FACTOR_PAIRS);
  const direction = pick(['A to B', 'B to A']);

  const actualK = direction === 'A to B' ? pair.k : frac(pair.k.d, pair.k.n);
  const actualType = cmp(actualK, 1) > 0 ? 'an enlargement' : cmp(actualK, 1) < 0 ? 'a reduction' : 'congruent';

  const questionText = `A model maker has two similar figures, A and B. Side in figure A is ${pair.sA} cm, and the matching side in figure B is ${pair.sB} cm. What is the scale factor from ${direction === 'A to B' ? 'figure A to figure B' : 'figure B to figure A'}?`;

  const correctAnswer = `${toDisplay(actualK)}, ${actualType}`;
  const invK = frac(actualK.d, actualK.n);
  const distractor1 = `${toDisplay(invK)}, ${cmp(invK, 1) > 0 ? 'an enlargement' : 'a reduction'}`;
  const distractor2 = `${toDisplay(actualK)}, ${actualType === 'an enlargement' ? 'a reduction' : 'an enlargement'}`;
  const diff = direction === 'A to B' ? pair.sB - pair.sA : pair.sA - pair.sB;
  const distractor3 = `${diff > 0 ? '+' : ''}${diff} cm (difference)`;

  const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3], (c) => `${c}/2, an enlargement`);

  return {
    id: `w2_q${id}`,
    districtId: 2,
    category: "SCALE FACTOR",
    visual: "ratio-table",
    questionText,
    options,
    correctAnswer,
    explanation: `The scale factor from ${direction === 'A to B' ? 'A to B is (length in B) ÷ (length in A)' : 'B to A is (length in A) ÷ (length in B)'} = ${toDisplay(actualK)}. Since ${toDisplay(actualK)} ${cmp(actualK, 1) > 0 ? '> 1' : '< 1'}, it is ${actualType}.`,
    hint1: "Scale factor from X to Y is always (length in Y) divided by (length in X).",
    hint2: "A scale factor greater than 1 is an enlargement; less than 1 is a reduction.",
    visualData: {
      sideA: pair.sA,
      sideB: pair.sB,
      direction,
      k: actualK,
    },
  };
}

/**
 * World 3: Missing Lengths (`find-unknown-lengths-similar`)
 */
export function generateUnknownLengthItem(id) {
  const kVal = pick([2, 3]);
  const sA1 = pick([4, 6]);
  const sB1 = sA1 * kVal;
  const sA2 = pick([8, 10]);
  const sB2 = sA2 * kVal; // correct answer

  const questionText = `△ABC ∼ △PQR with AB = ${sA1} cm, matching side PQ = ${sB1} cm, and BC = ${sA2} cm. Find the length of QR.`;
  const correctAnswer = `${sB2} cm`;

  const diff = sB1 - sA1;
  const distractor1 = `${sA2 + diff} cm`; // additive misconception
  const distractor2 = `${sA2 * (kVal + 1)} cm`;
  const distractor3 = `${sA2 + 1} cm`;

  const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3], (c) => `${sB2 + c * 2} cm`);

  return {
    id: `w3_q${id}`,
    districtId: 3,
    category: "UNKNOWN LENGTHS",
    visual: "figure-pair",
    questionText,
    options,
    correctAnswer,
    explanation: `Find the scale factor: PQ / AB = ${sB1} / ${sA1} = ${kVal}. Then multiply the matching side BC: QR = BC × ${kVal} = ${sA2} × ${kVal} = ${sB2} cm. Never add the difference!`,
    hint1: "Find the scale factor by dividing the known matching side pair.",
    hint2: "Multiply BC by this scale factor (do not add the difference).",
    visualData: {
      figA: { sides: [sA1, sA2] },
      figB: { sides: [sB1, sB2] },
    },
  };
}

/**
 * World 4: Both Conditions (`are-polygons-similar`)
 */
export function generatePolygonSimilarityItem(id) {
  const kind = pick(['rectangle-square', 'rhombus-square']);

  if (kind === 'rectangle-square') {
    const questionText = "A square has sides of 5 cm (all angles 90°). A rectangle has dimensions 4 cm × 6 cm (all angles 90°). Are they similar?";
    const correctAnswer = "No — all angles are equal (90°), but the side ratios (4/5 ≠ 6/5) are not equal";
    const distractor1 = "Yes — all four angles in both figures are 90°";
    const distractor2 = "Yes — because they are both four-sided quadrilaterals";
    const distractor3 = "Cannot tell without measuring the diagonals";
    const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3]);

    return {
      id: `w4_q${id}`,
      districtId: 4,
      category: "BOTH CONDITIONS",
      visual: "figure-pair",
      questionText,
      options,
      correctAnswer,
      explanation: "For general polygons, equal angles alone do NOT prove similarity. Corresponding sides must also be in the same ratio. Here 4/5 ≠ 6/5.",
      hint1: "Polygons require BOTH conditions: equal angles AND proportional sides.",
      hint2: "Compare the ratio of width to length for both shapes.",
      visualData: { condition: 'equal-angles-unequal-sides' },
    };
  }

  const questionText = "Two rhombuses have side lengths 6 cm and 12 cm. One has angles 90° (a square), and the other has angles 60° and 120°. Are they similar?";
  const correctAnswer = "No — the sides are proportional (1 : 2), but their corresponding angles are not equal";
  const distractor1 = "Yes — because all sides in both rhombuses are in the ratio 1 : 2";
  const distractor2 = "Yes — because all four sides are equal within each figure";
  const distractor3 = "Cannot tell without knowing the perimeter";
  const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3]);

  return {
    id: `w4_q${id}`,
    districtId: 4,
    category: "BOTH CONDITIONS",
    visual: "figure-pair",
    questionText,
    options,
    correctAnswer,
    explanation: "Proportional sides alone do NOT prove similarity for polygons! Corresponding angles must also be equal. A 60°/120° rhombus is a different shape than a 90° square.",
    hint1: "Check both angles and sides: do both conditions hold?",
    hint2: "If angles differ (e.g. 60° vs 90°), the shapes cannot be similar.",
    visualData: { condition: 'proportional-sides-unequal-angles' },
  };
}

/**
 * World 5: Triangle Tests (`similar-triangle-tests`)
 */
export function generateTriangleTestItem(id) {
  const testCase = pick(['aa', 'sss', 'sas', 'cannot-tell']);

  if (testCase === 'aa') {
    const a1 = pick([40, 50, 60]);
    const a2 = pick([55, 65, 70]);
    const questionText = `In △ABC, ∠A = ${a1}° and ∠B = ${a2}°. In △DEF, ∠D = ${a1}° and ∠E = ${a2}°. Are the triangles similar? Name the test.`;
    const correctAnswer = "Similar (AA)";
    const distractor1 = "Cannot tell — because the third angle is not given";
    const distractor2 = "Not similar — side lengths are not provided";
    const distractor3 = "Similar (SAS ratio)";
    const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3]);

    return {
      id: `w5_q${id}`,
      districtId: 5,
      category: "TRIANGLE TESTS",
      visual: "figure-pair",
      questionText,
      options,
      correctAnswer,
      explanation: "By the Angle-Angle (AA) test, if two pairs of corresponding angles are equal, the triangles are guaranteed similar (the third angle must also be equal by angle sum).",
      hint1: "Do two pairs of angles match?",
      hint2: "Two equal angle pairs guarantee similarity via the AA criterion.",
      visualData: { test: 'AA', angles: [a1, a2] },
    };
  }

  if (testCase === 'sss') {
    const k = pick([2, 3]);
    const s1 = 3, s2 = 4, s3 = 5;
    const sB1 = s1 * k, sB2 = s2 * k, sB3 = s3 * k;
    const questionText = `Triangle 1 has sides ${s1}, ${s2}, ${s3}. Triangle 2 has sides ${sB1}, ${sB2}, ${sB3}. Are they similar? Name the test.`;
    const correctAnswer = "Similar (SSS ratio)";
    const distractor1 = "Cannot tell — no angles are given";
    const distractor2 = "Not similar — the sides are not equal lengths";
    const distractor3 = "Similar (AA)";
    const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3]);

    return {
      id: `w5_q${id}`,
      districtId: 5,
      category: "TRIANGLE TESTS",
      visual: "figure-pair",
      questionText,
      options,
      correctAnswer,
      explanation: `All three side ratios equal ${k} (${sB1}/${s1} = ${sB2}/${s2} = ${sB3}/${s3} = ${k}). By SSS ratio, the triangles are similar.`,
      hint1: "Check if all three side pairs have the exact same ratio.",
      hint2: "Three proportional sides prove similarity (SSS ratio).",
      visualData: { test: 'SSS-ratio', k },
    };
  }

  if (testCase === 'sas') {
    const questionText = "Two triangles have two side pairs in the ratio 2 : 1, and the INCLUDED angle between those sides is 45° in both. Are they similar? Name the test.";
    const correctAnswer = "Similar (SAS ratio)";
    const distractor1 = "Cannot tell — the third side is not given";
    const distractor2 = "Similar (AA)";
    const distractor3 = "Not similar — sides must be equal";
    const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3]);

    return {
      id: `w5_q${id}`,
      districtId: 5,
      category: "TRIANGLE TESTS",
      visual: "figure-pair",
      questionText,
      options,
      correctAnswer,
      explanation: "By the SAS ratio test, two pairs of proportional sides with the INCLUDED angle equal guarantees similarity.",
      hint1: "The angle is between the two proportional sides.",
      hint2: "Two proportional sides with the included angle equal is the SAS ratio test.",
      visualData: { test: 'SAS-ratio' },
    };
  }

  // Cannot tell case
  const questionText = "Two triangles share one equal angle of 50° and no other information. What is the mathematically honest verdict?";
  const correctAnswer = "Cannot tell — one angle pair is not enough to prove similarity (counterexamples exist)";
  const distractor1 = "Similar (AA)";
  const distractor2 = "Definitely not similar";
  const distractor3 = "Similar (AAA)";
  const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3]);

  return {
    id: `w5_q${id}`,
    districtId: 5,
    category: "TRIANGLE TESTS",
    visual: "figure-pair",
    questionText,
    options,
    correctAnswer,
    explanation: "One angle pair alone is not a valid test. Multiple triangles with different shapes can share a 50° angle, so the honest verdict is 'cannot tell'.",
    hint1: "Is one angle pair listed as a valid similarity test?",
    hint2: "AA requires TWO angle pairs. With only one, we cannot tell.",
    visualData: { test: 'insufficient' },
  };
}

/**
 * World 6: Hidden Similar Triangles (`embedded-similar-triangles`)
 */
export function generateHiddenTriangleItem(id) {
  const k = pick([2, 3]);
  const AD = pick([3, 4, 5]);
  const AB = AD * k;
  const DE = pick([4, 6]);
  const BC = DE * k;

  const questionText = `In △ABC, DE ∥ BC with D on AB and E on AC. Given AD = ${AD} cm, AB = ${AB} cm, and DE = ${DE} cm. Find the length of BC.`;
  const correctAnswer = `${BC} cm`;

  const diff = AB - AD;
  const distractor1 = `${DE + diff} cm`;
  const distractor2 = `${DE * (k + 1)} cm`;
  const distractor3 = `${AD + DE + 2} cm`;

  const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3], (c) => `${BC + c * 3} cm`);

  return {
    id: `w6_q${id}`,
    districtId: 6,
    category: "HIDDEN TRIANGLES",
    visual: "nested-triangles",
    questionText,
    options,
    correctAnswer,
    explanation: `Since DE ∥ BC, ∠ADE = ∠ABC (corresponding angles) and ∠A is common, so △ADE ∼ △ABC (AA). The scale factor is AB / AD = ${AB} / ${AD} = ${k}. Therefore, BC = DE × ${k} = ${DE} × ${k} = ${BC} cm.`,
    hint1: "DE ∥ BC creates equal corresponding angles: △ADE is similar to △ABC.",
    hint2: "Find the scale factor by comparing whole side AB with matching side AD.",
    visualData: {
      kind: 'parallel-cut',
      AD, AB, DE, BC, k,
    },
  };
}

/**
 * World 7: Area and Volume Scale (`area-and-volume-ratios`)
 */
export function generateAreaVolumeItem(id) {
  const isVolume = Math.random() > 0.5;
  const k = pick([2, 3, 4]);

  if (!isVolume) {
    const areaA = pick([10, 25, 40]);
    const areaB = areaA * Math.pow(k, 2);

    const questionText = `Two similar signs have scale factor k = ${k} (the large sign is ${k} times as long as the small one). The small sign has area ${areaA} cm². What is the area of the large sign?`;
    const correctAnswer = `${areaB} cm²`;

    const distractor1 = `${areaA * k} cm²`; // scaled by k
    const distractor2 = `${areaA * Math.pow(k, 3)} cm²`; // scaled by k³
    const distractor3 = `${areaA * 2 + 5} cm²`;

    const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3], (c) => `${areaB + c * 20} cm²`);

    return {
      id: `w7_q${id}`,
      districtId: 7,
      category: "AREA & VOLUME RATIOS",
      visual: "scale-overlay",
      questionText,
      options,
      correctAnswer,
      explanation: `Length scales by k, but area scales by k²! Here k = ${k}, so area scales by ${k}² = ${Math.pow(k, 2)}. Area of large sign = ${areaA} × ${Math.pow(k, 2)} = ${areaB} cm².`,
      hint1: "Remember: lengths scale by k, but surface areas scale by k².",
      hint2: `Multiply the small area by ${k}² = ${Math.pow(k, 2)}.`,
      visualData: { k, areaA, areaB, dimension: 2 },
    };
  }

  // Volume
  const volA = pick([50, 100, 200]);
  const volB = volA * Math.pow(k, 3);

  const questionText = `Two similar model vases have heights 10 cm and ${10 * k} cm. The small vase holds ${volA} mL of water. How much does the large vase hold?`;
  const correctAnswer = `${volB} mL`;

  const distractor1 = `${volA * k} mL`; // scaled by k
  const distractor2 = `${volA * Math.pow(k, 2)} mL`; // scaled by k²
  const distractor3 = `${volA * 2 + 30} mL`;

  const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3], (c) => `${volB + c * 50} mL`);

  return {
    id: `w7_q${id}`,
    districtId: 7,
    category: "AREA & VOLUME RATIOS",
    visual: "solid-pair",
    questionText,
    options,
    correctAnswer,
    explanation: `The scale factor is ${10 * k} / 10 = ${k}. Volume scales by k³ = ${k}³ = ${Math.pow(k, 3)}! Large volume = ${volA} × ${Math.pow(k, 3)} = ${volB} mL.`,
    hint1: "Volumes and capacities scale by the cube of the scale factor (k³).",
    hint2: `Calculate k³ = ${k}³ = ${Math.pow(k, 3)}, then multiply the small capacity.`,
    visualData: { k, volA, volB, dimension: 3 },
  };
}

/**
 * World 8: Maps and Models (`scale-drawings-maps-models`)
 */
export function generateMapModelItem(id) {
  const scaleN = pick([10000, 50000, 100000]);
  const mapCm = pick([2, 4, 5, 8]);
  const realKm = (mapCm * scaleN) / 100000;

  const questionText = `A map has a scale of 1 : ${scaleN.toLocaleString()}. Two landmarks are ${mapCm} cm apart on the map. What is the actual distance between them in kilometres?`;
  const correctAnswer = `${realKm} km`;

  const distractor1 = `${realKm * 10} km`;
  const distractor2 = `${realKm / 10} km`;
  const distractor3 = `${(realKm * 2 + 1).toFixed(1).replace('.0', '')} km`;

  const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3], (c) => `${realKm + c} km`);

  return {
    id: `w8_q${id}`,
    districtId: 8,
    category: "MAPS & MODELS",
    visual: "map-strip",
    questionText,
    options,
    correctAnswer,
    explanation: `Actual distance = ${mapCm} cm × ${scaleN.toLocaleString()} = ${(mapCm * scaleN).toLocaleString()} cm. Since 100 000 cm = 1 km, ${(mapCm * scaleN).toLocaleString()} cm = ${realKm} km.`,
    hint1: "Multiply the map distance by the scale number to get actual centimetres.",
    hint2: "Convert centimetres to kilometres by dividing by 100 000 (100 cm/m × 1000 m/km).",
    visualData: { scaleN, mapCm, realKm },
  };
}

/**
 * World 9: The Grand Exhibition (`mixed-review`)
 */
export function generateMixedReviewItem(id) {
  const subType = id % 4;

  if (subType === 0) {
    const k = 3;
    const AD = 4;
    const AB = AD * k; // 12
    const areaSmall = 8;
    const areaLarge = areaSmall * Math.pow(k, 2); // 72

    const questionText = `In △ABC, DE ∥ BC with AD = ${AD} cm and AB = ${AB} cm. If the area of △ADE is ${areaSmall} cm², what is the area of △ABC?`;
    const correctAnswer = `${areaLarge} cm²`;
    const distractor1 = `${areaSmall * k} cm²`; // 24
    const distractor2 = `${areaSmall * 2} cm²`; // 16
    const distractor3 = `${areaSmall + 30} cm²`; // 38

    const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3], (c) => `${areaLarge + c * 10} cm²`);

    return {
      id: `w9_q${id}`,
      districtId: 9,
      category: "GRAND EXHIBITION",
      visual: "nested-triangles",
      questionText,
      options,
      correctAnswer,
      explanation: `△ADE ∼ △ABC with scale factor k = AB / AD = ${AB} / ${AD} = ${k}. Area scales by k² = ${k}² = ${Math.pow(k, 2)}. Area of △ABC = ${areaSmall} × ${Math.pow(k, 2)} = ${areaLarge} cm².`,
      hint1: "First find the length scale factor k, then square it to scale the area.",
      hint2: `k = ${k}, so area scales by k² = ${Math.pow(k, 2)}.`,
      visualData: { k, areaSmall, areaLarge },
    };
  }

  if (subType === 1) {
    return generateAreaVolumeItem(id);
  }

  if (subType === 2) {
    const scaleN = 10000;
    const mapAreaCm2 = 4;
    const realAreaKm2 = 0.04;
    const questionText = `A forest reserve covers ${mapAreaCm2} cm² on a 1 : 10 000 map. What is the actual area in square kilometres? (1 cm on map = 100 m in reality).`;
    const correctAnswer = `${realAreaKm2} km²`;
    const distractor1 = "0.4 km²";
    const distractor2 = "4 km²";
    const distractor3 = "0.08 km²";

    const options = makeFourOptions(correctAnswer, [distractor1, distractor2, distractor3], (c) => `${c} km²`);

    return {
      id: `w9_q${id}`,
      districtId: 9,
      category: "GRAND EXHIBITION",
      visual: "map-strip",
      questionText,
      options,
      correctAnswer,
      explanation: `1 cm on the map = 100 m = 0.1 km in reality. Area scales by the square: 1 cm² on the map = (0.1 km)² = 0.01 km². Therefore, ${mapAreaCm2} cm² = ${mapAreaCm2} × 0.01 = ${realAreaKm2} km².`,
      hint1: "Convert the linear scale first (1 cm = 0.1 km), then square it for area.",
      hint2: "1 cm² = (0.1)² = 0.01 km².",
      visualData: { mapAreaCm2, realAreaKm2 },
    };
  }

  return generateTriangleTestItem(id);
}
