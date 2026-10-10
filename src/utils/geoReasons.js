// src/utils/geoReasons.js
/**
 * SimilarQuest Geometric Reasons & Vocabulary
 * Standardised closed list aligned with Singapore Secondary 2 curriculum,
 * CongruenceQuest, ReasonQuest, and PRD/TRD specs.
 */

export const REASONS = [
  // Similarity Tests
  'similar-aa',
  'similar-sss-ratio',
  'similar-sas-ratio',

  // Corresponding parts of similar figures
  'corresponding-sides-proportional',
  'corresponding-angles-equal-similar-triangles',
  'scale-factor-definition',
  'area-scale-factor',
  'volume-scale-factor',

  // Congruence Tests (special case k=1)
  'sss',
  'sas',
  'asa',
  'aas',
  'rhs',

  // Structural & Given reasons
  'given',
  'given-equal-sides',
  'given-equal-angles',
  'common-side',
  'common-angle',
  'vertically-opposite-angles',
  'definition-of-midpoint',

  // Parallel line angle facts
  'alternate-angles-parallel',
  'corresponding-angles-parallel',
  'co-interior-angles-parallel',

  // Angle sum facts
  'angle-sum-triangle',
  'angles-on-straight-line',
  'base-angles-isosceles',

  // Quadrilateral & Deduction reasons
  'opposite-sides-parallelogram',
  'opposite-angles-parallelogram',
];

export const REASON_DISPLAY = {
  'similar-aa': {
    full: 'angle, angle similarity criterion',
    abbrev: '(AA)',
    condition: 'Two pairs of corresponding angles are equal',
    narration: 'because of the angle, angle similarity criterion',
    category: 'similarity',
  },
  'similar-sss-ratio': {
    full: 'three proportional sides criterion',
    abbrev: '(SSS ratio)',
    condition: 'All three pairs of corresponding sides are in the same ratio',
    narration: 'because all three pairs of corresponding sides are in the same ratio',
    category: 'similarity',
  },
  'similar-sas-ratio': {
    full: 'two proportional sides and included angle criterion',
    abbrev: '(SAS ratio)',
    condition: 'Two pairs of corresponding sides are in the same ratio and the INCLUDED angle between them is equal',
    narration: 'because two pairs of sides are in the same ratio and the angle between them is equal',
    category: 'similarity',
  },
  'corresponding-sides-proportional': {
    full: 'corresponding sides of similar triangles are proportional',
    abbrev: 'corr. sides of ∼ △s',
    condition: 'Triangles have already been proven similar earlier in the argument',
    narration: 'because corresponding sides of similar triangles are proportional',
    category: 'similarity',
  },
  'corresponding-angles-equal-similar-triangles': {
    full: 'corresponding angles of similar triangles are equal',
    abbrev: 'corr. ∠s of ∼ △s',
    condition: 'Triangles have already been proven similar earlier in the argument',
    narration: 'because corresponding angles of similar triangles are equal',
    category: 'similarity',
  },
  'scale-factor-definition': {
    full: 'scale factor definition',
    abbrev: 'scale factor',
    condition: 'Ratio of matching side lengths from figure A to figure B',
    narration: 'using the scale factor from figure A to figure B',
    category: 'similarity',
  },
  'area-scale-factor': {
    full: 'area scales by scale factor squared',
    abbrev: 'area ratio (k²)',
    condition: 'Area of similar figures scales by k²',
    narration: 'because area scales by the scale factor squared',
    category: 'similarity',
  },
  'volume-scale-factor': {
    full: 'volume scales by scale factor cubed',
    abbrev: 'volume ratio (k³)',
    condition: 'Volume of similar solids scales by k³',
    narration: 'because volume scales by the scale factor cubed',
    category: 'similarity',
  },
  'common-side': {
    full: 'common (shared) side',
    abbrev: 'common side',
    condition: 'Both triangles share the identical line segment',
    narration: 'because both triangles share the same side',
    category: 'structural',
  },
  'common-angle': {
    full: 'common (shared) angle',
    abbrev: 'common angle',
    condition: 'Both triangles share the identical angle vertex and arms',
    narration: 'because both triangles share the same angle',
    category: 'structural',
  },
  'vertically-opposite-angles': {
    full: 'vertically opposite angles',
    abbrev: 'vert. opp. ∠s',
    condition: 'Angles are opposite each other where two straight lines intersect',
    narration: 'because vertically opposite angles are equal',
    category: 'angles',
  },
  'alternate-angles-parallel': {
    full: 'alternate angles (parallel lines)',
    abbrev: 'alt. ∠s, // lines',
    condition: 'Lines MUST be marked parallel (Z-shape across transversal)',
    narration: 'because alternate angles are equal when lines are parallel',
    category: 'parallel',
  },
  'corresponding-angles-parallel': {
    full: 'corresponding angles (parallel lines)',
    abbrev: 'corr. ∠s, // lines',
    condition: 'Lines MUST be marked parallel (F-shape across transversal)',
    narration: 'because corresponding angles are equal when lines are parallel',
    category: 'parallel',
  },
  'co-interior-angles-parallel': {
    full: 'co-interior angles (parallel lines)',
    abbrev: 'int. ∠s, // lines',
    condition: 'Lines MUST be marked parallel; interior angles sum to 180°',
    narration: 'because co-interior angles sum to 180 degrees when lines are parallel',
    category: 'parallel',
  },
  'given': {
    full: 'given information',
    abbrev: 'given',
    condition: 'Explicitly marked or stated in the problem specification',
    narration: 'because it is given in the problem statement',
    category: 'givens',
  },
  'given-equal-sides': {
    full: 'given equal sides',
    abbrev: 'given',
    condition: 'Sides marked equal with tick marks',
    narration: 'because the sides are marked equal in the diagram',
    category: 'givens',
  },
  'given-equal-angles': {
    full: 'given equal angles',
    abbrev: 'given',
    condition: 'Angles marked equal with angle arcs',
    narration: 'because the angles are marked equal in the diagram',
    category: 'givens',
  },
  'definition-of-midpoint': {
    full: 'definition of midpoint',
    abbrev: 'midpoint def.',
    condition: 'Point divides a segment into two equal halves',
    narration: 'because the midpoint divides the segment into two equal lengths',
    category: 'structural',
  },
  'angle-sum-triangle': {
    full: 'angle sum of a triangle',
    abbrev: '∠ sum of △',
    condition: 'Three interior angles of any triangle sum to 180°',
    narration: 'because interior angles of a triangle sum to 180 degrees',
    category: 'triangles',
  },
  'angles-on-straight-line': {
    full: 'adjacent angles on a straight line',
    abbrev: 'adj. ∠s on a str. line',
    condition: 'Adjacent angles on a straight line sum to 180°',
    narration: 'because adjacent angles on a straight line sum to 180 degrees',
    category: 'lines',
  },
  'base-angles-isosceles': {
    full: 'base angles of an isosceles triangle',
    abbrev: 'base ∠s of isos. △',
    condition: 'Angles opposite equal sides in a triangle are equal',
    narration: 'because base angles opposite equal sides of an isosceles triangle are equal',
    category: 'triangles',
  },
  'opposite-sides-parallelogram': {
    full: 'opposite sides of a parallelogram',
    abbrev: 'opp. sides of //gram',
    condition: 'Opposite sides of a parallelogram are equal and parallel',
    narration: 'because opposite sides of a parallelogram are equal',
    category: 'parallelogram',
  },
  'opposite-angles-parallelogram': {
    full: 'opposite angles of a parallelogram',
    abbrev: 'opp. ∠s of //gram',
    condition: 'Opposite angles of a parallelogram are equal',
    narration: 'because opposite angles of a parallelogram are equal',
    category: 'parallelogram',
  },
  'sss': {
    full: 'side, side, side criterion (k = 1)',
    abbrev: '(SSS)',
    condition: 'Three pairs of corresponding sides are equal (congruence)',
    narration: 'because of the side, side, side criterion with scale factor one',
    category: 'congruence',
  },
  'sas': {
    full: 'side, angle, side criterion (k = 1)',
    abbrev: '(SAS)',
    condition: 'Two pairs of sides and the INCLUDED angle between them are equal',
    narration: 'because of the side, angle, side criterion',
    category: 'congruence',
  },
  'asa': {
    full: 'angle, side, angle criterion (k = 1)',
    abbrev: '(ASA)',
    condition: 'Two pairs of angles and the INCLUDED side between them are equal',
    narration: 'because of the angle, side, angle criterion',
    category: 'congruence',
  },
  'aas': {
    full: 'angle, angle, side criterion (k = 1)',
    abbrev: '(AAS)',
    condition: 'Two pairs of angles and a NON-INCLUDED corresponding side are equal',
    narration: 'because of the angle, angle, side criterion',
    category: 'congruence',
  },
  'rhs': {
    full: 'right angle, hypotenuse, side criterion (k = 1)',
    abbrev: '(RHS)',
    condition: 'Both triangles have 90° angles, equal hypotenuses, and one pair of equal legs',
    narration: 'because of the right angle, hypotenuse, side criterion',
    category: 'congruence',
  },
};

export const RULES = {
  'similar-aa': {
    requiredMatches: { angles: 2 },
    positionalCheck: 'two-angle-pairs',
    conclusion: 'similarity',
  },
  'similar-sss-ratio': {
    requiredMatches: { sides: 3 },
    positionalCheck: 'three-proportional-sides',
    conclusion: 'similarity',
  },
  'similar-sas-ratio': {
    requiredMatches: { sides: 2, angles: 1 },
    positionalCheck: 'angle-included-between-proportional-sides',
    conclusion: 'similarity',
  },
  'corresponding-sides-proportional': {
    requiresSimilarityFirst: true,
    conclusion: 'proportional-side-deduction',
  },
  'corresponding-angles-equal-similar-triangles': {
    requiresSimilarityFirst: true,
    conclusion: 'equal-angle-deduction',
  },
};
