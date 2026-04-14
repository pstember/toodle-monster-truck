import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  validateMatch,
  handleSuccessfulMatch,
  handleFailedMatch,
  checkLevelComplete
} from '../../src/match-validation.js';
import { gameState } from '../../src/state.js';
import { playSound } from '../../src/utils.js';

// Mock utils
vi.mock('../../src/utils.js', () => ({
  playSound: vi.fn()
}));

// Mock imported functions from match-validation.js
vi.mock('../../src/visual-effects.js', () => ({
  createConfetti: vi.fn(),
  showCelebrationOverlay: vi.fn(),
  hideCelebrationOverlay: vi.fn(),
  triggerIntermission: vi.fn()
}));

vi.mock('../../src/levels.js', () => ({
  generateLevel: vi.fn()
}));

vi.mock('../../src/drag-drop.js', () => ({
  handleDragStart: vi.fn()
}));

describe('Match Validation', () => {
  beforeEach(() => {
    // Reset game state
    gameState.slots = [];
    gameState.levelCompleting = false;
    gameState.intermissionCounter = 0;
    gameState.levelCount = 1;

    // Clear all mocks
    vi.clearAllMocks();

    // Setup minimal DOM
    document.body.innerHTML = `
      <div id="monster-truck"></div>
      <div id="inventory-items"></div>
    `;
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('validateMatch', () => {
    it('returns true when shape, color, and size all match', () => {
      const item = document.createElement('div');
      item.dataset.shape = 'circle';
      item.dataset.color = 'red';
      item.dataset.size = 'large';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'large';

      expect(validateMatch(item, slot)).toBe(true);
    });

    it('returns false when shape does not match', () => {
      const item = document.createElement('div');
      item.dataset.shape = 'circle';
      item.dataset.color = 'red';
      item.dataset.size = 'large';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'square';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'large';

      expect(validateMatch(item, slot)).toBe(false);
    });

    it('returns false when color does not match', () => {
      const item = document.createElement('div');
      item.dataset.shape = 'circle';
      item.dataset.color = 'red';
      item.dataset.size = 'large';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'blue';
      slot.dataset.requiredSize = 'large';

      expect(validateMatch(item, slot)).toBe(false);
    });

    it('returns false when size does not match', () => {
      const item = document.createElement('div');
      item.dataset.shape = 'circle';
      item.dataset.color = 'red';
      item.dataset.size = 'large';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'small';

      expect(validateMatch(item, slot)).toBe(false);
    });

    it('returns false when multiple properties do not match', () => {
      const item = document.createElement('div');
      item.dataset.shape = 'triangle';
      item.dataset.color = 'green';
      item.dataset.size = 'small';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'square';
      slot.dataset.requiredColor = 'blue';
      slot.dataset.requiredSize = 'large';

      expect(validateMatch(item, slot)).toBe(false);
    });
  });

  describe('handleSuccessfulMatch', () => {
    it('plays success sound', () => {
      const item = document.createElement('div');
      const slot = document.createElement('div');

      handleSuccessfulMatch(item, slot);

      expect(playSound).toHaveBeenCalledWith('success');
    });

    it('removes item from DOM', () => {
      const container = document.getElementById('inventory-items');
      const item = document.createElement('div');
      container.appendChild(item);

      const slot = document.createElement('div');

      expect(container.children.length).toBe(1);
      handleSuccessfulMatch(item, slot);
      expect(container.children.length).toBe(0);
    });

    it('clones item into slot', () => {
      const item = document.createElement('div');
      item.dataset.shape = 'circle';
      item.dataset.color = 'red';

      const slot = document.createElement('div');

      handleSuccessfulMatch(item, slot);

      expect(slot.children.length).toBe(1);
      const clone = slot.children[0];
      expect(clone.dataset.shape).toBe('circle');
      expect(clone.dataset.color).toBe('red');
    });

    it('adds filled class to slot', () => {
      const item = document.createElement('div');
      const slot = document.createElement('div');

      handleSuccessfulMatch(item, slot);

      expect(slot.classList.contains('filled')).toBe(true);
    });

    it('updates gameState.slots filled flag', () => {
      const slot = document.createElement('div');
      gameState.slots = [{ element: slot, filled: false }];

      const item = document.createElement('div');
      handleSuccessfulMatch(item, slot);

      expect(gameState.slots[0].filled).toBe(true);
    });

    it('cloned item has position relative', () => {
      const item = document.createElement('div');
      const slot = document.createElement('div');

      handleSuccessfulMatch(item, slot);

      const clone = slot.children[0];
      expect(clone.style.position).toBe('relative');
    });

    it('cloned item has snapping class', () => {
      const item = document.createElement('div');
      const slot = document.createElement('div');

      handleSuccessfulMatch(item, slot);

      const clone = slot.children[0];
      expect(clone.classList.contains('snapping')).toBe(true);
    });
  });

  describe('handleFailedMatch', () => {
    it('plays tryAgain sound', () => {
      const item = document.createElement('div');

      handleFailedMatch(item);

      expect(playSound).toHaveBeenCalledWith('tryAgain');
    });

    it('removes dragging class', () => {
      const item = document.createElement('div');
      item.classList.add('dragging');

      handleFailedMatch(item);

      expect(item.classList.contains('dragging')).toBe(false);
    });

    it('adds bouncing class', () => {
      const item = document.createElement('div');

      handleFailedMatch(item);

      expect(item.classList.contains('bouncing')).toBe(true);
    });

    it('resets position styles', () => {
      const item = document.createElement('div');
      item.style.position = 'absolute';
      item.style.left = '100px';
      item.style.top = '200px';
      item.style.transform = 'rotate(10deg)';

      handleFailedMatch(item);

      expect(item.style.position).toBe('relative');
      expect(item.style.left).toBe('');
      expect(item.style.top).toBe('');
      expect(item.style.transform).toBe('');
    });

    it('sets aria-grabbed to false', () => {
      const item = document.createElement('div');
      item.setAttribute('aria-grabbed', 'true');

      handleFailedMatch(item);

      expect(item.getAttribute('aria-grabbed')).toBe('false');
    });
  });

  describe('checkLevelComplete', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('does nothing when not all slots filled', () => {
      gameState.slots = [
        { filled: true },
        { filled: false }
      ];

      checkLevelComplete();

      expect(playSound).not.toHaveBeenCalled();
    });

    it('plays levelComplete sound when all slots filled', () => {
      gameState.slots = [
        { filled: true },
        { filled: true }
      ];

      checkLevelComplete();

      expect(playSound).toHaveBeenCalledWith('levelComplete');
    });

    it('prevents race condition with levelCompleting flag', () => {
      gameState.slots = [{ filled: true }];
      gameState.levelCompleting = false;

      checkLevelComplete();
      expect(gameState.levelCompleting).toBe(true);

      // Second call should not trigger again
      vi.clearAllMocks();
      checkLevelComplete();
      expect(playSound).not.toHaveBeenCalled();
    });

    it('adds driving-off class to truck', () => {
      gameState.slots = [{ filled: true }];
      const truck = document.getElementById('monster-truck');

      checkLevelComplete();

      expect(truck.classList.contains('driving-off')).toBe(true);
    });

    it('increments intermission counter', () => {
      gameState.slots = [{ filled: true }];
      gameState.intermissionCounter = 2;

      checkLevelComplete();

      expect(gameState.intermissionCounter).toBe(3);
    });
  });
});
