import { describe, it, expect } from 'vitest';
import { bscControlPolygon, sampleBscTongueEdge } from './bsc-tongue.js';

describe('bsc-tongue (Mathematica-style NURBS tab)', () => {
  it('keeps endpoints of a long edge', () => {
    const p1 = [0.1, 0.2];
    const p2 = [0.9, 0.75];
    const pts = sampleBscTongueEdge(p1, p2, 1, 32);
    expect(pts.length).toBeGreaterThan(4);
    expect(pts[0][0]).toBeCloseTo(p1[0], 5);
    expect(pts[0][1]).toBeCloseTo(p1[1], 5);
    const last = pts[pts.length - 1];
    expect(last[0]).toBeCloseTo(p2[0], 5);
    expect(last[1]).toBeCloseTo(p2[1], 5);
  });

  it('collapses to a line when the tab segment is extremely short', () => {
    const p1 = [0, 0];
    const p2 = [0.015, 0.015];
    const pts = sampleBscTongueEdge(p1, p2, 1, 10);
    expect(pts).toHaveLength(2);
  });

  it('builds a 6-point control polygon matching the bsc scaffolding', () => {
    const poly = bscControlPolygon([0, 0], [1, 0], -1);
    expect(poly).toHaveLength(6);
    expect(poly[0]).toEqual([0, 0]);
    expect(poly[5]).toEqual([1, 0]);
  });
});
