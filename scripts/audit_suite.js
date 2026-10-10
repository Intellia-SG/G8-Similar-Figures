// scripts/audit_suite.js
/**
 * CongruenceQuest Automated Test & Audit Suite
 * Covers TRD §10 requirements:
 * 1. Question bank stress test (≥300 generations)
 * 2. Test-validity audit (SSS, SAS, ASA, AAS, RHS vs SSA, AAA)
 * 3. Verdict audit (congruent vs not-congruent vs cannot-tell)
 * 4. Statement & correspondence audit
 * 5. Hidden-match necessity audit
 * 6. Chain-validity audit (checkChain & validOrderings)
 */

import { areCongruent, classifyMarks, findCounterexample, verdict, congruenceStatement, vertexOrderMismatch, correspondingParts } from '../src/utils/congruenceMath.js';
import { checkChain, validOrderings } from '../src/utils/geoFacts.js';
import { hiddenMatches, buildConstruction } from '../src/utils/congruenceDiagram.js';
import {
  generateOrientationItem,
  generateStatementItem,
  generateUnknownItem,
  generateTestItem,
  generateIncludedItem,
  generateVerdictItem,
  generateHiddenMatchItem,
  generateArgumentItem,
  generateDeductionItem,
  generateMixedItem,
} from '../src/utils/congruenceProblems.js';
import questionBank from '../src/data/questionBank.js';

console.log("=================================================");
console.log("  CongruenceQuest QA & Mathematical Audit Suite  ");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
}

// ─── 1. Question Bank Stress Test (≥300 runs) ───────────────────
console.log("▶ 1. Running Question Bank Stress Test (300 cycles)...");
const generators = [
  generateOrientationItem,
  generateStatementItem,
  generateUnknownItem,
  generateTestItem,
  generateIncludedItem,
  generateVerdictItem,
  generateHiddenMatchItem,
  generateArgumentItem,
  generateDeductionItem,
  generateMixedItem,
];

for (let cycle = 0; cycle < 300; cycle++) {
  generators.forEach((gen, gIdx) => {
    const q = gen(cycle);
    assert(q.id, `Question has ID in cycle ${cycle}, gen ${gIdx}`);
    assert(typeof q.districtId === 'number', `districtId is numeric`);
    assert(q.questionText && q.questionText.length > 5, `questionText is non-empty`);
    assert(Array.isArray(q.options) && q.options.length >= 3, `options array has at least 3 items`);
    assert(q.correctAnswer, `correctAnswer is defined`);
    assert(q.explanation, `explanation is non-empty`);
    // Assert no undefined, NaN, or null in options
    q.options.forEach((opt, optIdx) => {
      assert(opt !== undefined && opt !== 'undefined', `Option ${optIdx} is not undefined`);
      assert(opt !== null && opt !== 'null', `Option ${optIdx} is not null`);
      assert(!opt.includes('NaN'), `Option ${optIdx} does not contain NaN`);
    });
  });
}
console.log("   ✅ 300-cycle Question Bank Stress Test passed (3,000 generated items verified).\n");

// ─── 2. Test-Validity Audit ─────────────────────────────────────
console.log("▶ 2. Running Test-Validity Audit...");
assert(classifyMarks({ sides: 3 }) === 'sss', "SSS classified correctly");
assert(classifyMarks({ sides: 2, angles: 1, includedAngle: true }) === 'sas', "SAS classified correctly");
assert(classifyMarks({ sides: 2, angles: 1, includedAngle: false }) === 'ssa-not-a-test', "SSA correctly marked as non-test");
assert(classifyMarks({ sides: 1, angles: 2, includedSide: true }) === 'asa', "ASA classified correctly");
assert(classifyMarks({ sides: 1, angles: 2, includedSide: false }) === 'aas', "AAS classified correctly");
assert(classifyMarks({ sides: 0, angles: 3 }) === 'aaa-not-a-test', "AAA correctly marked as non-test");
assert(classifyMarks({ isRightAngle: true, hasHypotenuseAndLeg: true, sides: 2 }) === 'rhs', "RHS classified correctly");

// Verify counterexamples for non-tests
const ssaCe = findCounterexample({ sides: 2, angles: 1, includedAngle: false });
assert(ssaCe.hasCounterexample === true, "SSA produces genuine counterexample");
assert(ssaCe.triangles && ssaCe.triangles.length === 2, "SSA counterexample has 2 triangles");
assert(!areCongruent(ssaCe.triangles[0], ssaCe.triangles[1]), "SSA counterexample triangles are non-congruent");

const aaaCe = findCounterexample({ sides: 0, angles: 3 });
assert(aaaCe.hasCounterexample === true, "AAA produces genuine counterexample (different sizes)");
console.log("   ✅ Test-Validity Audit passed.\n");

// ─── 3. Verdict Audit ───────────────────────────────────────────
console.log("▶ 3. Running Verdict Audit...");
assert(verdict({ sides: 3 }) === 'congruent', "SSS yields congruent");
assert(verdict({ sides: 2, angles: 1, includedAngle: true }) === 'congruent', "SAS yields congruent");
assert(verdict({ sides: 2, angles: 1, includedAngle: false }) === 'cannot-tell', "SSA yields cannot-tell");
assert(verdict({ sides: 0, angles: 3 }) === 'cannot-tell', "AAA yields cannot-tell");
assert(verdict({}, { hasUnequalCorrespondingPart: true }) === 'not-congruent', "Unequal part yields not-congruent");
console.log("   ✅ Verdict Audit passed.\n");

// ─── 4. Statement & Correspondence Audit ────────────────────────
console.log("▶ 4. Running Statement & Correspondence Audit...");
const stmt = congruenceStatement(['A', 'B', 'C'], ['P', 'Q', 'R'], [0, 1, 2]);
assert(stmt === '△ABC ≅ △PQR', "Congruence statement format is △ABC ≅ △PQR");
const parts = correspondingParts(stmt);
assert(parts.sides.length === 3, "3 corresponding sides extracted");
assert(parts.angles.length === 3, "3 corresponding angles extracted");
assert(parts.sides[0].side1 === 'AB' && parts.sides[0].side2 === 'PQ', "First side match AB=PQ");

const mismatch = vertexOrderMismatch(['A', 'B', 'C'], ['P', 'Q', 'R'], [0, 1, 2]);
assert(mismatch !== stmt, "vertexOrderMismatch produces genuine mismatch");
console.log("   ✅ Statement & Correspondence Audit passed.\n");

// ─── 5. Hidden-Match Necessity Audit ────────────────────────────
console.log("▶ 5. Running Hidden-Match Necessity Audit...");
const overlapFig = buildConstruction({ type: 'overlap' });
const matches = hiddenMatches(overlapFig);
assert(matches.length >= 1, "Hidden match detected on overlap figure");
assert(matches[0].type === 'common-side', "Identifies common side on overlap figure");
console.log("   ✅ Hidden-Match Necessity Audit passed.\n");

// ─── 6. Chain-Validity Audit ────────────────────────────────────
console.log("▶ 6. Running Chain-Validity Audit...");
const validChain = [
  { statement: "AB = PQ", reason: "given", type: "premise" },
  { statement: "∠B = ∠Q", reason: "given", type: "premise" },
  { statement: "BC = QR", reason: "given", type: "premise" },
  { statement: "∴ △ABC ≅ △PQR (SAS)", reason: "sas", type: "congruence", tri1: "ABC", tri2: "PQR" },
  { statement: "Hence, AC = PR", reason: "corresponding-parts-congruent-triangles", type: "deduction" },
];
const validRes = checkChain(validChain);
assert(validRes.valid === true, "Valid chain passes checkChain");
assert(validOrderings(validChain) === true, "Valid chain respects dependency ordering");

const prematureChain = [
  { statement: "Hence, AC = PR", reason: "corresponding-parts-congruent-triangles", type: "deduction" },
  { statement: "AB = PQ", reason: "given", type: "premise" },
  { statement: "∴ △ABC ≅ △PQR (SAS)", reason: "sas", type: "congruence" },
];
const prematureRes = checkChain(prematureChain);
assert(prematureRes.valid === false, "Premature CPCTC deduction caught");
assert(prematureRes.failureType === 'corresponding-parts-before-congruence', "Caught with correct failureType");

const invalidOrdering = [
  validChain[3], // Test first
  validChain[0],
  validChain[1],
  validChain[2],
  validChain[4],
];
assert(validOrderings(invalidOrdering) === false, "Test before premises rejected by validOrderings");
console.log("   ✅ Chain-Validity Audit passed.\n");

console.log("=================================================");
console.log(`🎉 ALL AUDITS PASSED! Total assertions: ${passedTests}/${totalTests}`);
console.log("=================================================");
