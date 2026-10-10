// src/utils/similarityDiagram.js
/**
 * SimilarQuest Diagram Constructions, Enlargements, and Embedded Figures
 * Aligned with TRD §4.4.
 */

import { areSimilar } from './similarityMath.js';

/**
 * Builds coordinate specifications for 2D geometric figures.
 */
export function buildConstruction(type = 'triangle', params = {}) {
  if (type === 'triangle') {
    const { a = 6, b = 8, c = 10, baseWidth = 120, height = 80, labels = ['A', 'B', 'C'] } = params;
    return {
      type: 'triangle',
      vertices: [
        { x: 30, y: 110, label: labels[0] },
        { x: 30 + baseWidth, y: 110, label: labels[1] },
        { x: 60, y: 110 - height, label: labels[2] },
      ],
      sides: [a, b, c],
      labels,
    };
  }

  if (type === 'rectangle') {
    const { width = 80, height = 50, labels = ['A', 'B', 'C', 'D'] } = params;
    return {
      type: 'rectangle',
      vertices: [
        { x: 20, y: 20, label: labels[0] },
        { x: 20 + width, y: 20, label: labels[1] },
        { x: 20 + width, y: 20 + height, label: labels[2] },
        { x: 20, y: 20 + height, label: labels[3] },
      ],
      width,
      height,
      labels,
    };
  }

  return { type: 'generic', vertices: [] };
}

/**
 * Applies a uniform enlargement about center point by scale factor k.
 */
export function applyEnlargement(figure, k = 1.5, center = { x: 0, y: 0 }) {
  if (!figure || !figure.vertices) return figure;
  const scaledVertices = figure.vertices.map(pt => ({
    x: center.x + (pt.x - center.x) * k,
    y: center.y + (pt.y - center.y) * k,
    label: pt.label,
  }));

  const scaledSides = (figure.sides || []).map(s => s * k);

  return {
    ...figure,
    vertices: scaledVertices,
    sides: scaledSides,
    scaleFactor: k,
  };
}

/**
 * Non-uniform stretch in one direction (kx ≠ ky).
 * Breaks similarity — angles change and side ratios disagree.
 */
export function nonUniformStretch(figure, kx = 1.5, ky = 1.0, center = { x: 0, y: 0 }) {
  if (!figure || !figure.vertices) return figure;
  const stretchedVertices = figure.vertices.map(pt => ({
    x: center.x + (pt.x - center.x) * kx,
    y: center.y + (pt.y - center.y) * ky,
    label: pt.label,
  }));

  const res = {
    ...figure,
    vertices: stretchedVertices,
    isStretched: true,
  };

  return res;
}

/**
 * Embedded hidden-triangle figures per TRD §4.4.
 * 1. 'parallel-cut' (DE ∥ BC in △ABC)
 * 2. 'crossing-between-parallels' (butterfly: AB ∥ CD crossing at X)
 * 3. 'nested-right-triangles' (shared 90° angle and shared vertex)
 */
export function embeddedFigure(kind = 'parallel-cut', config = {}) {
  if (kind === 'parallel-cut') {
    const k = config.k || 2; // small to big scale factor (e.g. 2 means AD=4, AB=8)
    const AD = config.AD || 4;
    const AB = AD * k;
    const DE = config.DE || 5;
    const BC = DE * k;

    const fig = {
      kind: 'parallel-cut',
      labels: { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E' },
      lengths: { AD, AB, DE, BC, DB: AB - AD },
      triangles: {
        small: { name: '△ADE', vertices: ['A', 'D', 'E'], sides: { AD, DE } },
        large: { name: '△ABC', vertices: ['A', 'B', 'C'], sides: { AB, BC } },
      },
      reasonChain: [
        { statement: '∠A is a common angle to both triangles', reason: 'common-angle' },
        { statement: '∠ADE = ∠ABC (since DE ∥ BC)', reason: 'corresponding-angles-parallel' },
        { statement: '∴ △ADE ∼ △ABC', reason: 'similar-aa' },
        { statement: 'BC / DE = AB / AD = ' + k, reason: 'corresponding-sides-proportional' },
      ],
      points: {
        A: { x: 100, y: 20 },
        B: { x: 30, y: 150 },
        C: { x: 170, y: 150 },
        D: { x: 65, y: 85 },
        E: { x: 135, y: 85 },
      },
    };
    return fig;
  }

  if (kind === 'crossing-between-parallels') {
    const k = config.k || 1.5;
    const fig = {
      kind: 'crossing-between-parallels',
      labels: { A: 'A', B: 'B', C: 'C', D: 'D', X: 'X' },
      reasonChain: [
        { statement: '∠AXB = ∠CXD', reason: 'vertically-opposite-angles' },
        { statement: '∠XAB = ∠XCD (since AB ∥ CD)', reason: 'alternate-angles-parallel' },
        { statement: '∴ △ABX ∼ △DCX', reason: 'similar-aa' },
      ],
      points: {
        A: { x: 30, y: 30 },
        B: { x: 130, y: 30 },
        X: { x: 90, y: 90 },
        C: { x: 160, y: 150 },
        D: { x: 40, y: 150 },
      },
    };
    return fig;
  }

  // Nested right triangles
  return {
    kind: 'nested-right-triangles',
    labels: { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E' },
    reasonChain: [
      { statement: '∠A is common to both triangles', reason: 'common-angle' },
      { statement: '∠ADE = ∠ABC = 90°', reason: 'given' },
      { statement: '∴ △ADE ∼ △ABC', reason: 'similar-aa' },
    ],
    points: {
      A: { x: 30, y: 140 },
      D: { x: 90, y: 140 },
      B: { x: 170, y: 140 },
      E: { x: 90, y: 80 },
      C: { x: 170, y: 20 },
    },
  };
}

/**
 * Separates overlapping or nested triangles into two distinct figures
 * with orientation and vertex labels preserved.
 */
export function separateOverlapping(embedded) {
  if (embedded.kind === 'parallel-cut') {
    return {
      tri1: {
        name: '△ADE (Smaller Model)',
        vertices: [
          { x: 50, y: 20, label: 'A' },
          { x: 20, y: 80, label: 'D' },
          { x: 80, y: 80, label: 'E' },
        ],
        sides: embedded.triangles?.small?.sides,
      },
      tri2: {
        name: '△ABC (Larger Original)',
        vertices: [
          { x: 180, y: 20, label: 'A' },
          { x: 130, y: 130, label: 'B' },
          { x: 230, y: 130, label: 'C' },
        ],
        sides: embedded.triangles?.large?.sides,
      },
    };
  }

  return null;
}

/**
 * Returns a sketch drawing distorted slightly so that ruler measurement
 * of pixel coordinates cannot bypass the geometric reasoning.
 */
export function distortNotToScale(vertices = []) {
  return vertices.map(pt => ({
    x: pt.x + (Math.sin(pt.x) * 3),
    y: pt.y + (Math.cos(pt.y) * 3),
    label: pt.label,
  }));
}
