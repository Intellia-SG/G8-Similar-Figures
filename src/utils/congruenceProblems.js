// src/utils/congruenceProblems.js
/**
 * CongruenceQuest Procedural Question Generators & Misconception Models
 * Powers the 100 procedural questions in data/questionBank.js across 10 worlds.
 */

import { congruenceStatement, vertexOrderMismatch } from './congruenceMath.js';
import { buildConstruction } from './congruenceDiagram.js';

export const misconception = {
  flippedNotCongruent: (label) => `No, because triangle ${label} is flipped over and faces the opposite direction`,
  lookSameAsEvidence: () => "Yes, because they look like identical twins from the audience",
  positionalCorrespondence: (t1, t2) => `A matches the leftmost vertex of ${t2}, regardless of statement order`,
  vertexOrderMismatch: (t1, t2, mapping) => vertexOrderMismatch(t1, t2, mapping),
  asaVsAas: () => "ASA, because there are two angles and one side (ignoring side position)",
  sasVsSsa: () => "SAS, because two sides and an angle are equal (ignoring whether angle is between them)",
  ssaAsTest: () => "SSA (Side-Side-Angle)",
  aaaAsTest: () => "AAA (Angle-Angle-Angle)",
  cannotTellAsNotCongruent: () => "No, they are definitely not congruent",
  missedCommonSide: () => "They only have two matched parts; no other parts are equal",
  correspondingPartsBeforeCongruence: () => "Concluding sides are equal before proving the triangles are congruent",
  equalsInsteadOfCongruent: (t1, t2) => `△${t1} = △${t2} (using = instead of ≅)`,
};

/**
 * World 0: Same Shape, Same Size (congruent-figures-and-orientation)
 */
export function generateOrientationItem(idx = 0) {
  const isCongruent = idx % 2 === 0;
  const motion = idx % 3 === 0 ? 'flip' : idx % 3 === 1 ? 'turn' : 'slide';
  const motionDesc = motion === 'flip' ? 'a flipped mirror-image copy' : motion === 'turn' ? 'a turned/rotated copy' : 'a shifted copy';

  const spec = {
    type: 'pair',
    labels1: ['A', 'B', 'C'],
    labels2: ['P', 'Q', 'R'],
    motion,
    sideA: 6,
    sideB: 8,
    sideC: 10,
    marks: { sides: 3 },
  };

  const questionText = isCongruent
    ? `Triangle PQR is ${motionDesc} of Triangle ABC. Both have side lengths 6 cm, 8 cm, and 10 cm. Are the two triangles congruent?`
    : `Triangle PQR has side lengths 6 cm, 8 cm, and 12 cm, while Triangle ABC has sides 6 cm, 8 cm, and 10 cm. Are they congruent?`;

  const correctAnswer = isCongruent ? "Yes, they are congruent" : "No, they are not congruent";
  const options = isCongruent
    ? [
        "Yes, they are congruent",
        misconception.flippedNotCongruent('PQR'),
        "Cannot tell without measuring all three angles",
        "Only if they face the same direction",
      ]
    : [
        "No, they are not congruent",
        misconception.lookSameAsEvidence(),
        "Yes, because two sides match (6 cm and 8 cm)",
        "Cannot tell without knowing the angles",
      ];

  const explanation = isCongruent
    ? `Congruent figures have exactly the same shape and size. A copy can be slid, turned, or flipped over and it remains congruent!`
    : `Corresponding sides are not equal (12 cm ≠ 10 cm). Looking similar is not enough; congruent figures must have equal dimensions.`;

  return {
    id: `w0_q${idx}`,
    districtId: 0,
    category: "CONGRUENT FIGURES",
    questionText,
    options: shuffleArray(options),
    correctAnswer,
    explanation,
    hint1: "Congruence means exactly the same shape and size.",
    hint2: "Does turning or flipping an object change its size or shape?",
    visual: "triangle-pair",
    visualData: {
      construction: buildConstruction(spec),
      description: `Triangle ABC has sides 6, 8, 10 cm. Triangle PQR is ${motionDesc}.`,
    },
  };
}

/**
 * World 1: Matching Parts (corresponding-parts-and-statements)
 */
export function generateStatementItem(idx = 0) {
  const letters = [
    { t1: ['A', 'B', 'C'], t2: ['P', 'Q', 'R'] },
    { t1: ['X', 'Y', 'Z'], t2: ['D', 'E', 'F'] },
    { t1: ['K', 'L', 'M'], t2: ['U', 'V', 'W'] },
  ][idx % 3];

  const mappings = [
    { map: [1, 2, 0], desc: `${letters.t1[0]}↔${letters.t2[1]}, ${letters.t1[1]}↔${letters.t2[2]}, ${letters.t1[2]}↔${letters.t2[0]}` },
    { map: [2, 0, 1], desc: `${letters.t1[0]}↔${letters.t2[2]}, ${letters.t1[1]}↔${letters.t2[0]}, ${letters.t1[2]}↔${letters.t2[1]}` },
    { map: [0, 2, 1], desc: `${letters.t1[0]}↔${letters.t2[0]}, ${letters.t1[1]}↔${letters.t2[2]}, ${letters.t1[2]}↔${letters.t2[1]}` },
  ];
  const chosen = mappings[idx % mappings.length];
  const correctStmt = congruenceStatement(letters.t1, letters.t2, chosen.map);
  const wrong1 = `△${letters.t1.join('')} ≅ △${letters.t2.join('')}`;
  const wrong2 = `△${letters.t1.join('')} = △${chosen.map.map(i => letters.t2[i]).join('')}`;
  const wrong3 = `△${letters.t1.join('')} ≅ △${letters.t2[chosen.map[1]]}${letters.t2[chosen.map[0]]}${letters.t2[chosen.map[2]]}`;

  const options = Array.from(new Set([correctStmt, wrong1, wrong2, wrong3]));
  while (options.length < 4) options.push(`△${letters.t1.reverse().join('')} ≅ △${letters.t2.join('')}`);

  return {
    id: `w1_q${idx}`,
    districtId: 1,
    category: "CONGRUENCE STATEMENTS",
    questionText: `△${letters.t1.join('')} is congruent to △${letters.t2.join('')}, with corresponding vertices: ${chosen.desc}. Which congruence statement is written in correct matching order?`,
    options: shuffleArray(options),
    correctAnswer: correctStmt,
    explanation: `The order of vertices in a congruence statement defines the correspondence. Since ${chosen.desc}, the statement must be ${correctStmt}. Also remember to use ≅, not =!`,
    hint1: "Match the first letter of the first triangle with the first letter of the second triangle.",
    hint2: "The vertex order in the statement must follow the matching pairs exactly.",
    visual: "correspondence-table",
    visualData: {
      table: chosen.desc,
      statement: correctStmt,
      description: `Correspondence: ${chosen.desc}`,
    },
  };
}

/**
 * World 2: Use the Copy (find-unknowns-from-congruent-figures)
 */
export function generateUnknownItem(idx = 0) {
  const x = (idx % 5) + 3; // e.g. x = 3, 4, 5, 6, 7
  const sideKnown = 2 * x + 5; // e.g. 2(3)+5 = 11 cm
  const distractor1 = String(sideKnown);
  const distractor2 = String(x + 2);
  const distractor3 = String(2 * x);

  const questionText = `△ABC ≅ △PQR. It is given that AB = ${sideKnown} cm and corresponding side PQ = (2x + 5) cm. What is the value of x?`;
  const correctAnswer = String(x);

  return {
    id: `w2_q${idx}`,
    districtId: 2,
    category: "FIND UNKNOWNS",
    questionText,
    options: shuffleArray([correctAnswer, distractor1, distractor2, distractor3]),
    correctAnswer,
    explanation: `Because △ABC ≅ △PQR, corresponding sides are equal: AB = PQ. So ${sideKnown} = 2x + 5 ➔ 2x = ${sideKnown - 5} ➔ x = ${x}.`,
    hint1: "Corresponding sides of congruent triangles are equal in length.",
    hint2: `Set 2x + 5 equal to ${sideKnown} and solve for x.`,
    visual: "triangle-pair",
    visualData: {
      construction: buildConstruction({
        labels1: ['A', 'B', 'C'],
        labels2: ['P', 'Q', 'R'],
        marks: { sides: 2 },
      }),
      description: `AB = ${sideKnown} cm, PQ = (2x + 5) cm.`,
    },
  };
}

/**
 * World 3: Three Is Enough (identify-congruence-test)
 */
export function generateTestItem(idx = 0) {
  const tests = [
    {
      test: 'SSS',
      given: 'AB = DE, BC = EF, and AC = DF',
      exp: 'Three pairs of corresponding sides are equal (SSS criterion).',
    },
    {
      test: 'SAS',
      given: 'AB = DE, BC = EF, and included angle ∠B = ∠E',
      exp: 'Two pairs of sides and the included angle between them are equal (SAS criterion).',
    },
    {
      test: 'ASA',
      given: '∠B = ∠E, ∠C = ∠F, and included side BC = EF',
      exp: 'Two pairs of angles and the included side between them are equal (ASA criterion).',
    },
    {
      test: 'AAS',
      given: '∠A = ∠D, ∠B = ∠E, and non-included side BC = EF',
      exp: 'Two pairs of angles and a non-included corresponding side are equal (AAS criterion).',
    },
    {
      test: 'RHS',
      given: '∠B = ∠E = 90°, hypotenuses AC = DF, and one leg AB = DE',
      exp: 'Right angle, hypotenuse, and one corresponding leg are equal (RHS criterion).',
    },
  ];

  const chosen = tests[idx % tests.length];
  const options = ['SSS', 'SAS', 'ASA', 'AAS', 'RHS'].filter(t => t !== chosen.test);
  const finalOptions = shuffleArray([chosen.test, options[0], options[1], options[2]]);

  return {
    id: `w3_q${idx}`,
    districtId: 3,
    category: "CONGRUENCE TESTS",
    questionText: `For △ABC and △DEF, the following parts are marked equal: ${chosen.given}. Which congruence criterion proves △ABC ≅ △DEF?`,
    options: finalOptions,
    correctAnswer: chosen.test,
    explanation: chosen.exp,
    hint1: "Count how many sides and how many angles are marked equal.",
    hint2: "Notice whether the angle is between the sides, or whether the side is between the angles.",
    visual: "triangle-pair",
    visualData: {
      construction: buildConstruction({
        labels1: ['A', 'B', 'C'],
        labels2: ['D', 'E', 'F'],
        marks: { test: chosen.test },
      }),
      description: chosen.given,
    },
  };
}

/**
 * World 4: Included or Not? (included-vs-non-included)
 */
export function generateIncludedItem(idx = 0) {
  const isAngleQuestion = idx % 2 === 0;

  if (isAngleQuestion) {
    const isIncluded = idx % 4 === 0;
    const questionText = isIncluded
      ? "In △ABC, which angle is the INCLUDED angle between side AB and side BC?"
      : "In △ABC, which angle is a NON-INCLUDED angle with respect to side AB and side BC?";
    const correctAnswer = isIncluded ? "∠B" : "∠A (or ∠C)";
    const options = isIncluded
      ? ["∠B", "∠A", "∠C", "All three angles"]
      : ["∠A (or ∠C)", "∠B", "Both ∠A and ∠B", "There are no non-included angles"];

    return {
      id: `w4_q${idx}`,
      districtId: 4,
      category: "INCLUDED VS NON-INCLUDED",
      questionText,
      options: shuffleArray(options),
      correctAnswer,
      explanation: isIncluded
        ? "The included angle between sides AB and BC is ∠B, the vertex where the two sides meet."
        : "∠B is between sides AB and BC. The non-included angles are ∠A and ∠C.",
      hint1: "Look at the letter shared by both sides AB and BC.",
      hint2: "The shared vertex is the included angle between the two arms.",
      visual: "triangle-pair",
      visualData: {
        description: "△ABC with sides AB and BC highlighted.",
      },
    };
  } else {
    // Side included or not
    const isIncluded = idx % 4 === 1;
    const questionText = isIncluded
      ? "In △ABC, which side is the INCLUDED side between angle ∠A and angle ∠B?"
      : "In △ABC, which side is a NON-INCLUDED side with respect to angle ∠A and angle ∠B?";
    const correctAnswer = isIncluded ? "Side AB" : "Side BC (or AC)";
    const options = isIncluded
      ? ["Side AB", "Side BC", "Side AC", "Any side"]
      : ["Side BC (or AC)", "Side AB", "Both AB and BC", "None of the sides"];

    return {
      id: `w4_q${idx}`,
      districtId: 4,
      category: "INCLUDED VS NON-INCLUDED",
      questionText,
      options: shuffleArray(options),
      correctAnswer,
      explanation: isIncluded
        ? "Side AB connects vertex A and vertex B directly, making it the included side between ∠A and ∠B."
        : "Side AB is between ∠A and ∠B. Sides BC and AC are non-included.",
      hint1: "Which side connects the two angles directly?",
      hint2: "The segment whose endpoints are the two angle vertices is the included side.",
      visual: "triangle-pair",
      visualData: {
        description: "△ABC with angles ∠A and ∠B highlighted.",
      },
    };
  }
}

/**
 * World 5: Not Enough Info (insufficient-information)
 * Three-way verdicts: congruent, not congruent, cannot tell.
 * SSA items strictly in the textbook ambiguous configuration!
 */
export function generateVerdictItem(idx = 0) {
  const type = idx % 3 === 0 ? 'ssa' : idx % 3 === 1 ? 'aaa' : 'not-congruent';

  if (type === 'ssa') {
    return {
      id: `w5_q${idx}`,
      districtId: 5,
      category: "THREE-WAY VERDICT",
      questionText: "In △ABC and △PQR, AB = PQ = 10 cm, BC = QR = 6 cm, and non-included angle ∠A = ∠P = 30°. Can we conclude the triangles are congruent?",
      options: [
        "Cannot tell (SSA is not a valid test; two different triangles are possible)",
        "Yes, they are congruent by SAS",
        "No, they are definitely not congruent",
        "Yes, by SSS",
      ],
      correctAnswer: "Cannot tell (SSA is not a valid test; two different triangles are possible)",
      explanation: "SSA (two sides and a non-included angle) is ambiguous: the 6 cm side can swing into an acute triangle or an obtuse triangle. Because two different triangles can have these exact measurements, we cannot tell!",
      hint1: "Is the angle between the two given sides, or is it non-included?",
      hint2: "SSA allows two different triangles to be constructed.",
      visual: "pin-board",
      visualData: {
        description: "Ambiguous SSA configuration: two triangles possible.",
      },
    };
  }

  if (type === 'aaa') {
    return {
      id: `w5_q${idx}`,
      districtId: 5,
      category: "THREE-WAY VERDICT",
      questionText: "△ABC and △DEF have three pairs of equal angles: ∠A = ∠D = 50°, ∠B = ∠E = 60°, and ∠C = ∠F = 70°. Are the two triangles congruent?",
      options: [
        "Cannot tell (AAA only shows they have the same shape, but one could be larger)",
        "Yes, they are congruent by AAA",
        "No, they are definitely not congruent",
        "Yes, because all three angles match",
      ],
      correctAnswer: "Cannot tell (AAA only shows they have the same shape, but one could be larger)",
      explanation: "AAA guarantees identical shape (similarity), but NOT identical size! One triangle could be an enlarged copy of the other. Thus, without at least one side length, we cannot tell.",
      hint1: "Does having the same angles guarantee the same size?",
      hint2: "Think of a small photo and an enlarged poster of the same picture.",
      visual: "triangle-pair",
      visualData: {
        description: "Two triangles with equal angles but unknown side lengths.",
      },
    };
  }

  // Not congruent (explicitly unequal corresponding parts)
  return {
    id: `w5_q${idx}`,
    districtId: 5,
    category: "THREE-WAY VERDICT",
    questionText: "△ABC has sides 5 cm, 7 cm, 9 cm. △DEF has sides 5 cm, 7 cm, 11 cm. Are the two triangles congruent?",
    options: [
      "No, they are not congruent (corresponding side 9 cm ≠ 11 cm)",
      "Cannot tell without knowing the angles",
      "Yes, because two sides are equal (5 cm and 7 cm)",
      "Cannot tell without a protractor",
    ],
    correctAnswer: "No, they are not congruent (corresponding side 9 cm ≠ 11 cm)",
    explanation: "Here a corresponding side is shown to be unequal (9 cm ≠ 11 cm). This definitely rules out congruence, so the honest verdict is 'not congruent'.",
    hint1: "Check all three side lengths.",
    hint2: "If a corresponding measurement is proven unequal, they cannot be identical.",
    visual: "triangle-pair",
    visualData: {
      description: "Sides: [5, 7, 9] vs [5, 7, 11].",
    },
  };
}

/**
 * World 6: Hidden Matches (hidden-common-parts-overlapping)
 */
export function generateHiddenMatchItem(idx = 0) {
  const isCommonSide = idx % 2 === 0;

  if (isCommonSide) {
    return {
      id: `w6_q${idx}`,
      districtId: 6,
      category: "HIDDEN MATCHES",
      questionText: "Quadrilateral ABCD has diagonal BD drawn, dividing it into △ABD and △CDB. Given AB = CD and AD = CB, what third matched part is true but not marked?",
      options: [
        "BD = BD (common shared side)",
        "∠A = ∠C (assumed from looks)",
        "AC = BD (diagonals are always equal)",
        "There are no other equal parts",
      ],
      correctAnswer: "BD = BD (common shared side)",
      explanation: "Both △ABD and △CDB share the diagonal segment BD. A shared edge is a common side (BD = BD), giving three equal side pairs for SSS!",
      hint1: "Look at the segment that belongs to both triangles at once.",
      hint2: "A line segment shared by two figures is equal to itself (common side).",
      visual: "overlap-figure",
      visualData: {
        construction: buildConstruction({ type: 'overlap' }),
        description: "ABCD with diagonal BD shared by both triangles.",
      },
    };
  }

  // Vertically opposite angles
  return {
    id: `w6_q${idx}`,
    districtId: 6,
    category: "HIDDEN MATCHES",
    questionText: "Line segments AC and BD intersect at point X, forming △ABX and △CDX. Given AX = CX and BX = DX, what hidden matched part proves △ABX ≅ △CDX?",
    options: [
      "∠AXB = ∠CXD (vertically opposite angles)",
      "AB = CD (assumed from the diagram)",
      "∠A = ∠D (assumed)",
      "BX = AX (must be equal)",
    ],
    correctAnswer: "∠AXB = ∠CXD (vertically opposite angles)",
    explanation: "Where two straight lines intersect at vertex X, the angles opposite each other (∠AXB and ∠CXD) are vertically opposite angles and therefore equal. This provides the included angle for SAS!",
    hint1: "What geometric angle rule applies whenever two straight lines cross in an X shape?",
    hint2: "Vertically opposite angles are equal.",
    visual: "overlap-figure",
    visualData: {
      construction: buildConstruction({ type: 'vertical-opposite' }),
      description: "AC and BD intersect at X.",
    },
  };
}

/**
 * World 7: Order in the Argument (structured-congruence-argument)
 */
export function generateArgumentItem(idx = 0) {
  const steps = [
    "1. Prove/state 3 matched facts with geometric reasons",
    "2. State the congruence criterion in brackets: △ABC ≅ △PQR (SAS)",
    "3. Conclude deduced results ('hence, AB = PQ')",
  ];

  return {
    id: `w7_q${idx}`,
    districtId: 7,
    category: "PROOF ARGUMENTS",
    questionText: "What is the correct logical order for a guided congruence proof?",
    options: [
      "State 3 matched facts with reasons ➔ State congruence with test in brackets ➔ Conclude 'hence' deductions",
      "State 'hence' conclusion first ➔ State test ➔ Find 3 facts",
      "State congruence ➔ Give 3 facts ➔ Name the test",
      "Assume looking equal is evidence ➔ Deduce lengths",
    ],
    correctAnswer: "State 3 matched facts with reasons ➔ State congruence with test in brackets ➔ Conclude 'hence' deductions",
    explanation: "A valid proof must establish the evidence first (3 facts with reasons), then state the congruence with the test in brackets (e.g. SAS), and only THEN deduce further equal parts ('hence').",
    hint1: "Can you conclude an answer before you provide the evidence?",
    hint2: "Facts with reasons come first, then the test, then the final deduction.",
    visual: "argument-chain",
    visualData: {
      steps: [
        { text: "AB = PQ (given)", reason: "given" },
        { text: "∠B = ∠Q (given)", reason: "given" },
        { text: "BC = QR (given)", reason: "given" },
        { text: "∴ △ABC ≅ △PQR (SAS)", reason: "sas" },
        { text: "Hence, AC = PR", reason: "corresponding-parts-congruent-triangles" },
      ],
      description: "Structured proof chain layout.",
    },
  };
}

/**
 * World 8: Hence… (deductions-and-simple-proofs)
 */
export function generateDeductionItem(idx = 0) {
  return {
    id: `w8_q${idx}`,
    districtId: 8,
    category: "HENCE DEDUCTIONS",
    questionText: "We have proven that △ABD ≅ △CDB for a stage flat. What can we deduce next ('Hence...'), and what is the reason?",
    options: [
      "Hence AD = CB, because corresponding sides of congruent triangles are equal",
      "Hence AD = CB, because they look parallel",
      "Hence ∠A = 90°, because triangles are always right-angled",
      "Hence perimeter is doubled, by SSS",
    ],
    correctAnswer: "Hence AD = CB, because corresponding sides of congruent triangles are equal",
    explanation: "Once two triangles are proven congruent, ALL their corresponding parts are equal! So corresponding side AD equals side CB (corr. sides of ≅ △s).",
    hint1: "What does 'congruent' tell us about the remaining corresponding parts?",
    hint2: "Corresponding sides and angles of congruent triangles are equal.",
    visual: "argument-chain",
    visualData: {
      description: "△ABD ≅ △CDB ➔ Hence AD = CB.",
    },
  };
}

/**
 * World 9: The Grand Opening Night (mixed-review)
 */
export function generateMixedItem(idx = 0) {
  const subGenerators = [
    generateOrientationItem,
    generateStatementItem,
    generateUnknownItem,
    generateTestItem,
    generateVerdictItem,
    generateHiddenMatchItem,
    generateDeductionItem,
  ];
  const item = subGenerators[idx % subGenerators.length](idx + 10);
  item.id = `w9_q${idx}`;
  item.districtId = 9;
  item.category = "GRAND FINALE";
  return item;
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
