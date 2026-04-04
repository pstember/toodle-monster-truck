/**
 * Voronoi partition + tongue-shaped edges (interlocking curves along cuts), following the idea in:
 * https://mathematica.stackexchange.com/questions/6706/how-can-i-calculate-a-jigsaw-puzzle-cut-path
 * (Voronoi tessellation, then replace straight edges with spline "tongues".)
 */
import { Delaunay } from 'd3-delaunay';
import { sampleBscTongueEdge } from './bsc-tongue.js';
import { DEFAULT_TONGUE_PARAMS } from './tongue-params.js';

/** Flat Float64Array [x0,y0,…] must use `new Delaunay(points)`, not `Delaunay.from` (which mis-reads .length). */

/** @param {[number, number]} p @param {[number, number]} q */
function samePoint(p, q) {
  return Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-9;
}

/** @param {[number, number]} a @param {[number, number]} b */
function comparePoints(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}

function roundCoord(x) {
  return Math.round(x * 1e6) / 1e6;
}

/** @param {[number, number]} p */
function pointKey(p) {
  return `${roundCoord(p[0])},${roundCoord(p[1])}`;
}

/** @param {[number, number]} a @param {[number, number]} b */
export function edgeKeyFromPoints(a, b) {
  const ka = pointKey(a);
  const kb = pointKey(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) || 0;
  }
  return h;
}

/** Clipped Voronoi vertices on [0,1]² — keep these segments straight (no tabs on outer frame). */
const BOUND_EPS = 2.5e-4;

/**
 * @param {[number, number]} a
 * @param {[number, number]} b
 */
export function isOuterBoundaryEdge(a, b) {
  const ax = a[0];
  const ay = a[1];
  const bx = b[0];
  const by = b[1];
  if (Math.abs(ax) < BOUND_EPS && Math.abs(bx) < BOUND_EPS) return true;
  if (Math.abs(ax - 1) < BOUND_EPS && Math.abs(bx - 1) < BOUND_EPS) return true;
  if (Math.abs(ay) < BOUND_EPS && Math.abs(by) < BOUND_EPS) return true;
  if (Math.abs(ay - 1) < BOUND_EPS && Math.abs(by - 1) < BOUND_EPS) return true;
  return false;
}

/**
 * Weighted cubic NURBS “bsc” tongue (Mathematica SE jigsaw article): same family as
 * BSplineCurve[{p1, pm, …}, SplineWeights -> {1,5,5,5,5,1}/22].
 *
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @param {number} sign ±1 → rc (which side of the edge bulges; neighbor uses reversed polyline)
 * @param {number} segments passed to {@link sampleBscTongueEdge}
 */
/**
 * @param {object} [options] forwarded to {@link sampleBscTongueEdge}
 */
export function sampleTongueEdge(a, b, sign, segments = 42, options = {}) {
  return sampleBscTongueEdge(a, b, sign, segments, options);
}

/**
 * Straight segments from the Voronoi vertices to the tab, tab only on a sub-interval of the edge
 * (position + span from hash), with varied tab depth/width via BSC options — so tabs are not always centered.
 * @param {[number, number]} low
 * @param {[number, number]} high
 * @param {string} k canonical edge key
 * @param {number} sign ±1
 * @returns {[number, number][]}
 */
/**
 * Where several internal edges meet at a Voronoi vertex, only one keeps full tab size;
 * others are damped so perpendicular cuts do not both bulge into the same corner.
 * @param {Map<string, { low: [number, number], high: [number, number] }>} canonicalEdges
 * @param {Record<string, number>} p tongue params (see tongue-params.js)
 * @returns {Map<string, number>} multipliers in (0,1], keyed by edge key
 */
function computeCornerDampening(canonicalEdges, p) {
  /** @type {Map<string, string[]>} */
  const vertexToEdges = new Map();
  for (const [k, { low, high }] of canonicalEdges) {
    if (isOuterBoundaryEdge(low, high)) continue;
    for (const p of [low, high]) {
      const pk = pointKey(p);
      if (!vertexToEdges.has(pk)) vertexToEdges.set(pk, []);
      vertexToEdges.get(pk).push(k);
    }
  }
  /** @type {Map<string, number>} */
  const damp = new Map();
  for (const [k, { low, high }] of canonicalEdges) {
    if (!isOuterBoundaryEdge(low, high)) damp.set(k, 1);
  }
  for (const [, edges] of vertexToEdges) {
    const uniq = [...new Set(edges)].sort((a, b) => a.localeCompare(b));
    if (uniq.length < 2) continue;
    for (let r = 0; r < uniq.length; r++) {
      let factor = p.cornerDamp3;
      if (r === 0) factor = 1;
      else if (r === 1) factor = p.cornerDamp2;
      const ek = uniq[r];
      damp.set(ek, Math.min(damp.get(ek) ?? 1, factor));
    }
  }
  return damp;
}

/**
 * @param {number} cornerDamp Per-edge multiplier from {@link computeCornerDampening}
 * @param {Record<string, number>} p tongue params
 */
function buildInternalEdgeCurve(low, high, k, sign, cornerDamp, p) {
  const vx = high[0] - low[0];
  const vy = high[1] - low[1];
  const len = Math.hypot(vx, vy);
  if (len < p.minEdgeLength) {
    return [low, high];
  }

  const hu = hashStr(k) >>> 0;
  const h2 = hashStr(`${k}|tab`) >>> 0;
  const ha = hashStr(`${k}|amp`) >>> 0;
  const hw = hashStr(`${k}|wid`) >>> 0;
  const hs = hashStr(`${k}|seg`) >>> 0;

  const pad = p.edgeVertexPad;
  const inner = 1 - 2 * pad;
  if (inner < p.tabSpanMin + 1e-6) {
    return [low, high];
  }

  let span =
    p.tabSpanMin + (h2 % 700) / 700 * (Math.min(p.tabSpanMax, inner) - p.tabSpanMin);
  span = Math.min(span, inner);

  const half = span / 2;
  const centerMin = pad + half;
  const centerMax = 1 - pad - half;
  let center = centerMin + (hu % 1000) / 1000 * Math.max(1e-9, centerMax - centerMin);

  let t0 = center - half;
  let t1 = center + half;
  t0 = Math.max(pad, t0);
  t1 = Math.min(1 - pad, t1);
  if (t1 - t0 < p.tabSpanMin * 0.95) {
    const mid = (t0 + t1) / 2;
    const halfSpan = p.tabSpanMin / 2;
    t0 = Math.max(pad, mid - halfSpan);
    t1 = Math.min(1 - pad, mid + halfSpan);
  }

  const e1 = [low[0] + t0 * vx, low[1] + t0 * vy];
  const e2 = [low[0] + t1 * vx, low[1] + t1 * vy];

  const segLen = Math.hypot(e2[0] - e1[0], e2[1] - e1[1]);
  const lenScale = Math.min(
    p.lenScaleMax,
    p.lenScaleBase + p.lenScaleSlope * Math.min(1, segLen / p.refLen)
  );
  const shortChordDamp = Math.min(1, segLen / p.shortChordRef);

  const ampT = (ha % 1000) / 1000;
  const widT = (hw % 920) / 920;
  let amplitudeScale =
    (p.amplitudeMin + ampT * (p.amplitudeMax - p.amplitudeMin)) * lenScale * shortChordDamp;
  let widthScale =
    (p.widthMin + widT * (p.widthMax - p.widthMin)) * lenScale * shortChordDamp;

  amplitudeScale = Math.min(p.amplitudeMax, Math.max(p.amplitudeMin, amplitudeScale));
  widthScale = Math.min(p.widthMax, Math.max(p.widthMin, widthScale));

  const cd = Math.min(1, Math.max(0.45, cornerDamp));
  amplitudeScale *= cd;
  widthScale *= cd;
  amplitudeScale *= p.globalBulge;
  widthScale *= p.globalBulge;

  amplitudeScale = Math.min(2.6, Math.max(0.06, amplitudeScale));
  widthScale = Math.min(2.4, Math.max(0.06, widthScale));

  const segments = p.segmentsMin + (hs % p.segmentsSpread);

  const tonguePts = sampleBscTongueEdge(e1, e2, sign, segments, {
    amplitudeScale,
    widthScale,
    minChordLength: p.minChordLength,
  });

  const out = [];
  out.push(low);
  if (!samePoint(low, e1)) {
    out.push(e1);
  }
  for (let i = 1; i < tonguePts.length; i++) {
    out.push(tonguePts[i]);
  }
  if (!samePoint(out[out.length - 1], high)) {
    out.push(high);
  }
  return out;
}

/**
 * @param {number} cols
 * @param {number} rows
 * @param {() => number} randomFn
 * @param {Partial<import('./tongue-params.js').DEFAULT_TONGUE_PARAMS>} [tongueParams]
 */
export function buildVoronoiJigsaw(cols, rows, randomFn = Math.random, tongueParams = {}) {
  const p = { ...DEFAULT_TONGUE_PARAMS, ...tongueParams };
  const n = cols * rows;
  const sites = new Float64Array(n * 2);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const jx = (randomFn() - 0.5) * (0.4 / cols);
      const jy = (randomFn() - 0.5) * (0.4 / rows);
      let x = (c + 0.5) / cols + jx;
      let y = (r + 0.5) / rows + jy;
      x = Math.min(0.985, Math.max(0.015, x));
      y = Math.min(0.985, Math.max(0.015, y));
      sites[i * 2] = x;
      sites[i * 2 + 1] = y;
    }
  }

  const delaunay = new Delaunay(sites);
  const voronoi = delaunay.voronoi([0, 0, 1, 1]);

  /** @type {Map<string, { low: [number, number], high: [number, number] }>} */
  const canonicalEdges = new Map();

  for (let i = 0; i < n; i++) {
    const poly = voronoi.cellPolygon(i);
    if (!poly || poly.length < 3) continue;
    let verts = poly;
    if (verts.length > 1 && samePoint(verts[0], verts[verts.length - 1])) {
      verts = verts.slice(0, -1);
    }
    for (let j = 0; j < verts.length; j++) {
      const a = verts[j];
      const b = verts[(j + 1) % verts.length];
      const k = edgeKeyFromPoints(a, b);
      if (!canonicalEdges.has(k)) {
        const low = comparePoints(a, b) < 0 ? a : b;
        const high = comparePoints(a, b) < 0 ? b : a;
        canonicalEdges.set(k, { low, high });
      }
    }
  }

  const cornerDamp = computeCornerDampening(canonicalEdges, p);

  /** @type {Map<string, [number, number][]>} */
  const edgeCurveMap = new Map();
  for (const [k, { low, high }] of canonicalEdges) {
    if (isOuterBoundaryEdge(low, high)) {
      edgeCurveMap.set(k, [low, high]);
    } else {
      const sign = hashStr(k) % 2 === 0 ? 1 : -1;
      const cd = cornerDamp.get(k) ?? 1;
      edgeCurveMap.set(k, buildInternalEdgeCurve(low, high, k, sign, cd, p));
    }
  }

  /** @param {[number, number][]} pts */
  function bboxFromPoints(pts) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of pts) {
      minX = Math.min(minX, p[0]);
      minY = Math.min(minY, p[1]);
      maxX = Math.max(maxX, p[0]);
      maxY = Math.max(maxY, p[1]);
    }
    return { minX, minY, maxX, maxY };
  }

  const pieces = [];

  for (let i = 0; i < n; i++) {
    const poly = voronoi.cellPolygon(i);
    if (!poly || poly.length < 3) {
      pieces.push({
        pathD: 'M 0 0 L 1 0 L 1 1 L 0 1 Z',
        pathDNormalized: 'M 0 0 L 1 0 L 1 1 L 0 1 Z',
        minX: 0,
        minY: 0,
        maxX: 1,
        maxY: 1,
      });
      continue;
    }

    let verts = poly;
    if (verts.length > 1 && samePoint(verts[0], verts[verts.length - 1])) {
      verts = verts.slice(0, -1);
    }

    const allPts = [];

    for (let j = 0; j < verts.length; j++) {
      const a = verts[j];
      const b = verts[(j + 1) % verts.length];
      const k = edgeKeyFromPoints(a, b);
      const curvePts = edgeCurveMap.get(k);
      if (!curvePts) {
        if (allPts.length === 0) {
          allPts.push(a, b);
        } else if (!samePoint(allPts[allPts.length - 1], a)) {
          allPts.push(a, b);
        } else {
          allPts.push(b);
        }
        continue;
      }
      const forward = pointKey(a) < pointKey(b);
      const segment = forward ? curvePts : curvePts.slice().reverse();
      if (allPts.length === 0) {
        allPts.push(...segment);
      } else {
        const start = samePoint(allPts[allPts.length - 1], segment[0]) ? 1 : 0;
        for (let t = start; t < segment.length; t++) {
          allPts.push(segment[t]);
        }
      }
    }

    const bb = bboxFromPoints(allPts);
    const w = bb.maxX - bb.minX;
    const h = bb.maxY - bb.minY;
    const eps = 1e-8;
    const safeW = w < eps ? 1 : w;
    const safeH = h < eps ? 1 : h;

    let pathD = `M ${allPts[0][0]} ${allPts[0][1]}`;
    for (let p = 1; p < allPts.length; p++) {
      pathD += ` L ${allPts[p][0]} ${allPts[p][1]}`;
    }
    pathD += ' Z';

    let pathDNormalized = `M ${(allPts[0][0] - bb.minX) / safeW} ${(allPts[0][1] - bb.minY) / safeH}`;
    for (let p = 1; p < allPts.length; p++) {
      pathDNormalized += ` L ${(allPts[p][0] - bb.minX) / safeW} ${(allPts[p][1] - bb.minY) / safeH}`;
    }
    pathDNormalized += ' Z';

    pieces.push({
      pathD,
      pathDNormalized,
      minX: bb.minX,
      minY: bb.minY,
      maxX: bb.maxX,
      maxY: bb.maxY,
    });
  }

  return { pieces, sites };
}
