import { describe, it, expect, beforeEach } from 'vitest';
import { findSlotAtPosition } from '../../src/drag-drop.js';
import { gameState } from '../../src/state.js';

describe('Drag and Drop System', () => {
  beforeEach(() => {
    // Reset game state
    gameState.currentDragItem = null;
    gameState.dragOffset = { x: 0, y: 0 };
    gameState.slotRects = [];
    gameState.currentHoverSlot = null;
    gameState.rafId = null;
  });

  describe('findSlotAtPosition', () => {
    it('returns null when slotRects is empty', () => {
      gameState.slotRects = [];
      const result = findSlotAtPosition(100, 100);
      expect(result).toBeNull();
    });

    it('returns slot when position is inside slot bounds', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(100, 100);
      expect(result).toBe(mockSlot);
    });

    it('returns null when position is outside all slot bounds', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(200, 200);
      expect(result).toBeNull();
    });

    it('returns first matching slot when multiple slots overlap', () => {
      const slot1 = document.createElement('div');
      const slot2 = document.createElement('div');
      gameState.slotRects = [
        { element: slot1, rect: { left: 50, right: 150, top: 50, bottom: 150 } },
        { element: slot2, rect: { left: 50, right: 150, top: 50, bottom: 150 } }
      ];

      const result = findSlotAtPosition(100, 100);
      expect(result).toBe(slot1);
    });

    it('handles edge boundaries correctly (x on left edge)', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(50, 100);
      expect(result).toBe(mockSlot);
    });

    it('handles edge boundaries correctly (x on right edge)', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(150, 100);
      expect(result).toBe(mockSlot);
    });

    it('handles edge boundaries correctly (y on top edge)', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(100, 50);
      expect(result).toBe(mockSlot);
    });

    it('handles edge boundaries correctly (y on bottom edge)', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(100, 150);
      expect(result).toBe(mockSlot);
    });

    it('returns null when x is one pixel left of left boundary', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(49, 100);
      expect(result).toBeNull();
    });

    it('returns null when x is one pixel right of right boundary', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(151, 100);
      expect(result).toBeNull();
    });

    it('returns null when y is one pixel above top boundary', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(100, 49);
      expect(result).toBeNull();
    });

    it('returns null when y is one pixel below bottom boundary', () => {
      const mockSlot = document.createElement('div');
      gameState.slotRects = [
        {
          element: mockSlot,
          rect: { left: 50, right: 150, top: 50, bottom: 150 }
        }
      ];

      const result = findSlotAtPosition(100, 151);
      expect(result).toBeNull();
    });
  });
});
