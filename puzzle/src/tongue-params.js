/**
 * Live tongue / jigsaw tab parameters for tuning via UI sliders.
 * `getTongueParams()` is passed into {@link buildVoronoiJigsaw}.
 */

/** @typedef {typeof DEFAULT_TONGUE_PARAMS} TongueParams */

export const DEFAULT_TONGUE_PARAMS = {
  /** Multiplier on tab depth & width after other scaling (slider-friendly) */
  globalBulge: 2.5,
  amplitudeMin: 0.32,
  amplitudeMax: 1.22,
  widthMin: 0.44,
  widthMax: 1.34,
  edgeVertexPad: 0.11,
  tabSpanMin: 0.48,
  tabSpanMax: 0.54,
  refLen: 0.12,
  shortChordRef: 0.07,
  lenScaleMax: 1.08,
  lenScaleBase: 0.65,
  lenScaleSlope: 0.43,
  /** 2nd edge at a Voronoi vertex (relative to 1st) */
  cornerDamp2: 0.73,
  /** 3rd+ edges at a vertex */
  cornerDamp3: 0.66,
  segmentsMin: 26,
  segmentsSpread: 14,
  minEdgeLength: 0.06,
  /** Passed to bsc-tongue: chords shorter than this stay straight */
  minChordLength: 0.066,
};

let live = { ...DEFAULT_TONGUE_PARAMS };

/** @returns {TongueParams} */
export function getTongueParams() {
  return { ...live };
}

/** @param {Partial<TongueParams>} p */
export function setTongueParams(p) {
  live = { ...live, ...p };
}

export function resetTongueParams() {
  live = { ...DEFAULT_TONGUE_PARAMS };
}

/** @param {keyof TongueParams} key */
export function setTongueParam(key, value) {
  live[key] = value;
}
