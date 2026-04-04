import { describe, it, expect } from 'vitest';
import {
  buildVoronoiJigsaw,
  edgeKeyFromPoints,
  isOuterBoundaryEdge,
  sampleTongueEdge,
} from './voronoi-jigsaw.js';
import { createSeededRandom } from './puzzle-logic.js';

describe('voronoi-jigsaw', () => {
  it('builds one cell per grid slot with closed paths', () => {
    const rnd = createSeededRandom(12345);
    const { pieces } = buildVoronoiJigsaw(3, 4, rnd);
    expect(pieces).toHaveLength(12);
    for (const p of pieces) {
      expect(p.pathDNormalized).toMatch(/^M /);
      expect(p.pathDNormalized).toMatch(/Z$/);
      expect(p.maxX).toBeGreaterThan(p.minX);
      expect(p.maxY).toBeGreaterThan(p.minY);
    }
  });

  it('edge keys are order-independent', () => {
    const a = [0.1, 0.2];
    const b = [0.9, 0.8];
    expect(edgeKeyFromPoints(a, b)).toBe(edgeKeyFromPoints(b, a));
  });

  it('sampleTongueEdge returns more than two points for long edges', () => {
    const pts = sampleTongueEdge([0, 0], [1, 0], 1);
    expect(pts.length).toBeGreaterThan(2);
  });

  it('detects axis-aligned outer boundary segments', () => {
    expect(isOuterBoundaryEdge([0, 0.2], [0, 0.9])).toBe(true);
    expect(isOuterBoundaryEdge([1, 0.1], [1, 0.85])).toBe(true);
    expect(isOuterBoundaryEdge([0.1, 0], [0.9, 0])).toBe(true);
    expect(isOuterBoundaryEdge([0.2, 1], [0.7, 1])).toBe(true);
    expect(isOuterBoundaryEdge([0.1, 0.1], [0.9, 0.9])).toBe(false);
  });
});
