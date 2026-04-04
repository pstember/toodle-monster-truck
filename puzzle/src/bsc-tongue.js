/**
 * "bsc" style tongue from the Voronoi jigsaw article (Mathematica Stack Exchange):
 * BSplineCurve with SplineWeights -> {1,5,5,5,5,1}/22 morphs a segment into a tab.
 *
 * Control polygon (same as f[]/bsc[] scaffolding):
 *   pm = (p1+p2)/2, dp = (p2-p1)/5,  perp = rc * {dpy, -dpx}  with dp = (dpx,dpy)
 *   {p1, pm, pm - dp + perp, pm + dp + perp, pm, p2}
 *
 * rc = ±1 picks which side of the edge the tongue bulges (neighbor uses same edge reversed).
 */

/** Open uniform cubic knot vector for 6 control points (indices 0..5). */
const U_BSC = [0, 0, 0, 0, 1, 2, 3, 4, 4, 4];
const P_DEG = 3;
const W_BSC = [1 / 22, 5 / 22, 5 / 22, 5 / 22, 5 / 22, 1 / 22];

/**
 * Cox–de Boor recursion for B-spline basis N_{i,p}(u).
 * @param {number[]} U knot vector
 */
function basisN(i, p, u, U) {
  if (p === 0) {
    const n = U.length - 1;
    if (i < 0 || i > n - 1) return 0;
    if (u >= U[i] && u < U[i + 1]) return 1;
    // Include right endpoint of last span
    if (i === n - 1 && u >= U[i] && u <= U[i + 1]) return 1;
    return 0;
  }
  let left = 0;
  let right = 0;
  const denL = U[i + p] - U[i];
  const denR = U[i + p + 1] - U[i + 1];
  if (Math.abs(denL) > 1e-14) {
    left = ((u - U[i]) / denL) * basisN(i, p - 1, u, U);
  }
  if (Math.abs(denR) > 1e-14) {
    right = ((U[i + p + 1] - u) / denR) * basisN(i + 1, p - 1, u, U);
  }
  return left + right;
}

/**
 * One point on the rational B-spline (NURBS) curve.
 * @param {[number, number][]} ctrl
 * @param {number[]} w
 * @param {number} u parameter in [U[p], U[n]] where n = last ctrl index
 */
function nurbsPoint2D(u, ctrl, w, U, p) {
  let cx = 0;
  let cy = 0;
  let dw = 0;
  for (let i = 0; i < ctrl.length; i++) {
    const N = basisN(i, p, u, U);
    cx += N * w[i] * ctrl[i][0];
    cy += N * w[i] * ctrl[i][1];
    dw += N * w[i];
  }
  if (Math.abs(dw) < 1e-16) return [ctrl[0][0], ctrl[0][1]];
  return [cx / dw, cy / dw];
}

/**
 * @typedef {{ amplitudeScale?: number; widthScale?: number; minChordLength?: number }} BscTongueOptions
 */

/**
 * Build the six B-spline control points (same construction as Mathematica `bsc`).
 * @param {[number, number]} p1
 * @param {[number, number]} p2
 * @param {number} rc ±1
 * @param {BscTongueOptions} [opts]
 * @returns {[number, number][]}
 */
export function bscControlPolygon(p1, p2, rc, opts = {}) {
  const amplitudeScale = opts.amplitudeScale ?? 1;
  const widthScale = opts.widthScale ?? 1;
  const inv5 = (1 / 5) * widthScale;
  const dpx = (p2[0] - p1[0]) * inv5;
  const dpy = (p2[1] - p1[1]) * inv5;
  const pm = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  // {1,-1} * Reverse[dp] = (dpy, -dpx) for dp = {dpx,dpy}
  let ox = rc * dpy;
  let oy = -rc * dpx;
  ox *= amplitudeScale;
  oy *= amplitudeScale;
  const c2 = [pm[0] - dpx + ox, pm[1] - dpy + oy];
  const c3 = [pm[0] + dpx + ox, pm[1] + dpy + oy];
  return [p1, pm, c2, c3, pm, p2];
}

/**
 * Sample the weighted cubic NURBS tongue along p1→p2.
 * @param {[number, number]} p1
 * @param {[number, number]} p2
 * @param {number} rc ±1 tongue side (deterministic per edge in caller)
 * @param {number} segments number of samples along parameter (inclusive ends)
 * @param {BscTongueOptions} [options] amplitudeScale / widthScale for visual variety
 * @returns {[number, number][]}
 */
export function sampleBscTongueEdge(p1, p2, rc, segments = 40, options = {}) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy);
  const minLenForCurve = options.minChordLength ?? 0.042;
  if (len < minLenForCurve) {
    return [p1, p2];
  }

  const ctrl = bscControlPolygon(p1, p2, rc, options);
  const uMin = U_BSC[P_DEG];
  const uMax = U_BSC[ctrl.length];
  const span = uMax - uMin;

  const pts = [];
  for (let i = 0; i <= segments; i++) {
    let t = i / segments;
    let u = uMin + t * span;
    if (i === segments) u = uMax - 1e-10;
    pts.push(nurbsPoint2D(u, ctrl, W_BSC, U_BSC, P_DEG));
  }
  pts[pts.length - 1] = [p2[0], p2[1]];
  pts[0] = [p1[0], p1[1]];
  return pts;
}
