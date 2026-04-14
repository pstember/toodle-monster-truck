import { describe, it, expect } from 'vitest';

describe('Rhythm Game - Pure Functions', () => {
  describe('starsFromHits', () => {
    const starsFromHits = (hits, total) => {
      const pct = total > 0 ? hits / total : 0;
      if (pct >= 0.95) return 3;
      if (pct >= 0.75) return 2;
      if (pct >= 0.50) return 1;
      return 0;
    };

    it('returns 0 stars for 0% hits', () => {
      expect(starsFromHits(0, 100)).toBe(0);
    });

    it('returns 1 star for 50-74% hits', () => {
      expect(starsFromHits(50, 100)).toBe(1);
      expect(starsFromHits(74, 100)).toBe(1);
    });

    it('returns 2 stars for 75-94% hits', () => {
      expect(starsFromHits(75, 100)).toBe(2);
      expect(starsFromHits(94, 100)).toBe(2);
    });

    it('returns 3 stars for 95%+ hits', () => {
      expect(starsFromHits(95, 100)).toBe(3);
      expect(starsFromHits(100, 100)).toBe(3);
    });

    it('handles edge case of 0 total', () => {
      expect(starsFromHits(0, 0)).toBe(0);
    });
  });

  describe('infiniteTierFromElapsed', () => {
    const infiniteTierFromElapsed = (t) => {
      const INFINITE_RAMP_SEC = 60;
      return Math.min(3, Math.floor(t / INFINITE_RAMP_SEC) + 1);
    };

    it('returns tier 1 for first 60 seconds', () => {
      expect(infiniteTierFromElapsed(0)).toBe(1);
      expect(infiniteTierFromElapsed(30)).toBe(1);
      expect(infiniteTierFromElapsed(59)).toBe(1);
    });

    it('returns tier 2 for 60-119 seconds', () => {
      expect(infiniteTierFromElapsed(60)).toBe(2);
      expect(infiniteTierFromElapsed(90)).toBe(2);
      expect(infiniteTierFromElapsed(119)).toBe(2);
    });

    it('returns tier 3 for 120+ seconds', () => {
      expect(infiniteTierFromElapsed(120)).toBe(3);
      expect(infiniteTierFromElapsed(180)).toBe(3);
      expect(infiniteTierFromElapsed(300)).toBe(3);
    });
  });

  describe('shuffleInPlace', () => {
    const shuffleInPlace = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    };

    it('modifies array length unchanged', () => {
      const arr = [1, 2, 3, 4, 5];
      shuffleInPlace(arr);
      expect(arr.length).toBe(5);
    });

    it('contains same elements after shuffle', () => {
      const arr = [1, 2, 3, 4, 5];
      shuffleInPlace(arr);
      expect(arr.sort()).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
