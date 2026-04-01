import { test, expect } from '@playwright/test';
import { GamePage } from '../helpers/game-page.js';

test.describe('Utility Functions', () => {
  test('shuffleArray maintains same length', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const originalLength = original.length;

      shuffleArray(original);

      return {
        lengthBefore: originalLength,
        lengthAfter: original.length
      };
    });

    expect(result.lengthBefore).toBe(result.lengthAfter);
    expect(result.lengthAfter).toBe(10);
  });

  test('shuffleArray contains same elements', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];

      shuffleArray(original);

      // Sort both to compare
      const sortedOriginal = [...original].sort((a, b) => a - b);
      const sortedCopy = copy.sort((a, b) => a - b);

      return {
        sorted1: sortedOriginal,
        sorted2: sortedCopy
      };
    });

    expect(result.sorted1).toEqual(result.sorted2);
  });

  test('shuffleArray handles empty array without error', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const empty = [];
      shuffleArray(empty);
      return {
        length: empty.length,
        success: true
      };
    });

    expect(result.success).toBe(true);
    expect(result.length).toBe(0);
  });
});
