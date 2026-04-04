import { describe, it, expect } from 'vitest';
import {
  createJigsawState,
  checkWin,
  canPlacePiece,
  placePiece,
  backgroundPercentForPiece,
  createSeededRandom,
  toRowCol,
} from './puzzle-logic.js';

describe('createJigsawState', () => {
  it('has empty board and all piece ids in tray', () => {
    const rng = createSeededRandom(42);
    const s = createJigsawState(3, 3, rng);
    expect(s.board.every((c) => c === null)).toBe(true);
    expect(s.tray.length).toBe(9);
    const sorted = [...s.tray].sort((a, b) => a - b);
    expect(sorted).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('is deterministic with seeded RNG', () => {
    const a = createJigsawState(3, 3, createSeededRandom(99));
    const b = createJigsawState(3, 3, createSeededRandom(99));
    expect(a.tray).toEqual(b.tray);
  });
});

describe('placePiece', () => {
  it('places only on matching slot', () => {
    const s = createJigsawState(2, 2, createSeededRandom(1));
    const p0 = s.tray.find((id) => id === 0);
    expect(p0).toBe(0);
    const next = placePiece(s, 0, 0);
    expect(next.board[0]).toBe(0);
    expect(next.tray.includes(0)).toBe(false);
  });

  it('rejects wrong slot', () => {
    const s = createJigsawState(2, 2, createSeededRandom(1));
    expect(placePiece(s, 0, 1)).toBeNull();
    expect(canPlacePiece(s, 0, 1)).toBe(false);
  });

  it('rejects occupied slot', () => {
    let s = createJigsawState(2, 2, createSeededRandom(1));
    s = placePiece(s, 0, 0);
    expect(placePiece(s, 1, 0)).toBeNull();
  });

  it('sets solved when complete', () => {
    const rng = createSeededRandom(7);
    let s = createJigsawState(2, 2, rng);
    // Solve manually in order
    for (let id = 0; id < 4; id++) {
      const next = placePiece(s, id, id);
      expect(next).not.toBeNull();
      s = next;
    }
    expect(s.solved).toBe(true);
    expect(checkWin(s)).toBe(true);
  });
});

describe('backgroundPercentForPiece', () => {
  it('avoids division by zero for 1 column', () => {
    const { bgX, bgY } = backgroundPercentForPiece(0, 1, 5);
    expect(bgX).toBe(50);
    expect(typeof bgY).toBe('number');
  });

  it('matches corners for 3x3', () => {
    expect(backgroundPercentForPiece(0, 3, 3)).toEqual({ bgX: 0, bgY: 0 });
    expect(backgroundPercentForPiece(2, 3, 3)).toEqual({ bgX: 100, bgY: 0 });
    const last = toRowCol(8, 3);
    expect(last).toEqual({ row: 2, col: 2 });
    expect(backgroundPercentForPiece(8, 3, 3)).toEqual({ bgX: 100, bgY: 100 });
  });
});
