// src/utils/ratio.js
/**
 * Exact Rational Arithmetic Engine for SimilarQuest
 * TRD §4.4: All scale factors, ratios, areas, and unit conversions must be exact.
 * Floating-point ratios will eventually make two "equal" ratios compare unequal,
 * so all ratio work goes through rational numbers, NEVER raw floats.
 */

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export class Rational {
  constructor(n, d = 1) {
    if (d === 0) throw new Error("Denominator cannot be zero");
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
      // In case integer conversion from small clean decimal:
      const precision = 10000;
      n = Math.round(n * precision);
      d = Math.round(d * precision);
    }
    const g = gcd(n, d);
    const sign = d < 0 ? -1 : 1;
    this.n = (sign * n) / g;
    this.d = Math.abs(d) / g;
  }
}

export function frac(n, d = 1) {
  if (n instanceof Rational) return n;
  if (typeof n === 'string' && n.includes('/')) {
    const [num, den] = n.split('/').map(s => parseInt(s.trim(), 10));
    return new Rational(num, den || 1);
  }
  return new Rational(n, d);
}

export function add(a, b) {
  const r1 = frac(a);
  const r2 = frac(b);
  return frac(r1.n * r2.d + r2.n * r1.d, r1.d * r2.d);
}

export function sub(a, b) {
  const r1 = frac(a);
  const r2 = frac(b);
  return frac(r1.n * r2.d - r2.n * r1.d, r1.d * r2.d);
}

export function mul(a, b) {
  const r1 = frac(a);
  const r2 = frac(b);
  return frac(r1.n * r2.n, r1.d * r2.d);
}

export function div(a, b) {
  const r1 = frac(a);
  const r2 = frac(b);
  if (r2.n === 0) throw new Error("Division by zero in rational arithmetic");
  return frac(r1.n * r2.d, r1.d * r2.n);
}

export function reciprocal(a) {
  const r = frac(a);
  if (r.n === 0) throw new Error("Cannot invert zero");
  return frac(r.d, r.n);
}

export function pow(a, k) {
  const r = frac(a);
  if (k === 0) return frac(1, 1);
  if (k < 0) return reciprocal(pow(r, -k));
  return frac(Math.pow(r.n, k), Math.pow(r.d, k));
}

export function eq(a, b) {
  const r1 = frac(a);
  const r2 = frac(b);
  return r1.n * r2.d === r2.n * r1.d;
}

export function cmp(a, b) {
  const r1 = frac(a);
  const r2 = frac(b);
  return (r1.n * r2.d) - (r2.n * r1.d);
}

export function toDecimal(a) {
  const r = frac(a);
  return r.n / r.d;
}

const NUMBER_WORDS = {
  1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
  6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
  12: 'twelve', 15: 'fifteen', 20: 'twenty', 25: 'twenty-five',
  50: 'fifty', 100: 'one hundred', 400: 'four hundred', 1000: 'one thousand',
  50000: 'fifty thousand'
};

function numToWord(num) {
  if (NUMBER_WORDS[num]) return NUMBER_WORDS[num];
  return String(num);
}

export function toDisplay(a, format = 'fraction') {
  const r = frac(a);
  if (format === 'ratio') {
    return `${r.n} : ${r.d}`;
  }
  if (format === 'spoken') {
    if (r.d === 1) return numToWord(r.n);
    if (r.n === 1 && r.d === 2) return "one half";
    if (r.n === 1 && r.d === 3) return "one third";
    if (r.n === 1 && r.d === 4) return "one quarter";
    if (r.n === 2 && r.d === 3) return "two thirds";
    if (r.n === 3 && r.d === 2) return "three over two";
    if (r.n === 5 && r.d === 2) return "five over two";
    return `${numToWord(r.n)} over ${numToWord(r.d)}`;
  }
  // default fraction
  if (r.d === 1) return `${r.n}`;
  return `${r.n}/${r.d}`;
}
