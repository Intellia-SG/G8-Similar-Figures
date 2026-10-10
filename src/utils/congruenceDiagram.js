// src/utils/congruenceDiagram.js
/**
 * CongruenceQuest Diagram Coordinate Engine
 * Constructs 2D geometry, rigid motions (slide, turn, true mirror flip), overlapping figures, and hidden match detection.
 */


/**
 * Builds standard 2D triangle coordinates:
 * tri: { a, b, c, angleA, angleB, angleC }
 * Places vertex A at (0, 0), B along the x-axis at (c, 0), and C using trigonometry.
 */
export function buildTriangleCoords(a = 6, b = 8, c = 10) {
  // Use Law of Cosines to find angle A in radians
  const cosA = (b * b + c * c - a * a) / (2 * b * c);
  const clampedCosA = Math.max(-1, Math.min(1, cosA));
  const angleA = Math.acos(clampedCosA);

  const Ax = 0;
  const Ay = 0;
  const Bx = c;
  const By = 0;
  const Cx = b * Math.cos(angleA);
  const Cy = b * Math.sin(angleA);

  return [
    { x: Ax, y: Ay },
    { x: Bx, y: By },
    { x: Cx, y: Cy },
  ];
}

/**
 * Applies a 2D rigid motion to a set of vertex coordinates.
 * kind: 'slide' | 'turn' | 'flip' | 'none'
 */
export function applyRigidMotion(coords = [], kind = 'none', params = {}) {
  const { dx = 50, dy = 0, angleDeg = 45, flipAxis = 'vertical' } = params;
  const rad = (angleDeg * Math.PI) / 180;

  // Find center of bounding box to rotate/flip in place
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  coords.forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return coords.map(p => {
    let x = p.x;
    let y = p.y;

    if (kind === 'flip') {
      if (flipAxis === 'vertical') {
        x = cx - (x - cx); // True mirror reflection across vertical axis
      } else {
        y = cy - (y - cy); // Reflection across horizontal axis
      }
    }

    if (kind === 'turn') {
      const cosT = Math.cos(rad);
      const sinT = Math.sin(rad);
      const relX = x - cx;
      const relY = y - cy;
      x = cx + (relX * cosT - relY * sinT);
      y = cy + (relX * sinT + relY * cosT);
    }

    return {
      x: x + dx,
      y: y + dy,
    };
  });
}

/**
 * Builds a construction containing two triangles.
 * Supports flipped and rotated copies.
 */
export function buildConstruction(spec = {}) {
  const {
    type = 'pair', // 'pair' | 'overlap' | 'shared-base' | 'vertical-opposite'
    sideA = 60,
    sideB = 70,
    sideC = 80,
    labels1 = ['A', 'B', 'C'],
    labels2 = ['P', 'Q', 'R'],
    motion = 'none', // 'slide' | 'turn' | 'flip'
    motionAngle = 35,
    marks = {},
  } = spec;

  const baseCoords1 = buildTriangleCoords(sideA, sideB, sideC);

  if (type === 'overlap') {
    // Parallelogram or overlapping triangles sharing a side or diagonal
    // e.g. △ABD and △CDB with diagonal BD
    const A = { x: 40, y: 130 };
    const B = { x: 120, y: 50 };
    const C = { x: 220, y: 50 };
    const D = { x: 140, y: 130 };

    return {
      type: 'overlap',
      tri1: { vertices: [A, B, D], labels: ['A', 'B', 'D'] },
      tri2: { vertices: [C, D, B], labels: ['C', 'D', 'B'] },
      shared: { type: 'side', vertices: [B, D], label: 'BD' },
      marks,
    };
  }

  if (type === 'vertical-opposite') {
    // Two triangles meeting at vertex X (hourglass / bow-tie shape)
    // Vertically opposite angles at X
    const X = { x: 130, y: 90 };
    const A = { x: 40, y: 40 };
    const B = { x: 50, y: 140 };
    const C = { x: 220, y: 140 };
    const D = { x: 210, y: 40 };

    return {
      type: 'vertical-opposite',
      tri1: { vertices: [A, B, X], labels: ['A', 'B', 'X'] },
      tri2: { vertices: [D, C, X], labels: ['D', 'C', 'X'] },
      shared: { type: 'vert-opp-vertex', vertex: X, label: 'X' },
      marks,
    };
  }

  // Standard pair
  const baseCoords2 = buildTriangleCoords(sideA, sideB, sideC);
  const shifted1 = baseCoords1.map(p => ({ x: p.x + 30, y: p.y + 40 }));
  const shifted2 = applyRigidMotion(baseCoords2, motion, {
    dx: 150,
    dy: 40,
    angleDeg: motionAngle,
    flipAxis: 'vertical',
  });

  return {
    type: 'pair',
    motion,
    tri1: { vertices: shifted1, labels: labels1 },
    tri2: { vertices: shifted2, labels: labels2 },
    marks,
  };
}

/**
 * Separates an overlapping construction into two standalone triangles
 * displayed side-by-side with identical vertex labels preserved.
 */
export function separateOverlapping(construction) {
  if (!construction || !construction.tri1 || !construction.tri2) return null;

  const t1 = construction.tri1;
  const t2 = construction.tri2;

  // Offset tri1 to the left, tri2 to the right
  const sep1 = {
    labels: [...t1.labels],
    vertices: t1.vertices.map(p => ({ x: p.x - 30, y: p.y })),
  };
  const sep2 = {
    labels: [...t2.labels],
    vertices: t2.vertices.map(p => ({ x: p.x + 60, y: p.y })),
  };

  return {
    separated: true,
    tri1: sep1,
    tri2: sep2,
    sharedPart: construction.shared,
  };
}

/**
 * Detects unmarked structural matches:
 * common side, common angle, vertically opposite angles, alternate interior angles
 */
export function hiddenMatches(construction = {}) {
  const matches = [];

  if (construction.type === 'overlap' && construction.shared) {
    if (construction.shared.type === 'side') {
      matches.push({
        type: 'common-side',
        reason: 'common-side',
        subject: `${construction.shared.label} is a common side`,
        description: `Both triangles share the side ${construction.shared.label}`,
      });
    }
  }

  if (construction.type === 'vertical-opposite') {
    matches.push({
      type: 'vertically-opposite-angles',
      reason: 'vertically-opposite-angles',
      subject: `∠AXB = ∠DXC`,
      description: 'Vertically opposite angles at intersecting vertex X are equal',
    });
  }

  if (construction.marks && construction.marks.parallelLines) {
    matches.push({
      type: 'alternate-angles-parallel',
      reason: 'alternate-angles-parallel',
      subject: 'Alternate interior angles are equal',
      description: 'Lines marked parallel create equal alternate interior angles',
    });
  }

  return matches;
}

/**
 * Returns slightly perturbed display coordinates to satisfy "not drawn to scale"
 * so visual measurement of pixel lengths cannot reveal the answer.
 */
export function distortNotToScale(coords = [], amount = 4) {
  return coords.map((p, i) => ({
    x: p.x + (i % 2 === 0 ? amount : -amount),
    y: p.y + (i % 2 === 1 ? amount : -amount),
  }));
}
