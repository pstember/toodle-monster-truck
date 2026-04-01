import { test, expect } from '@playwright/test';
import { GamePage } from '../helpers/game-page.js';

test.describe('Progressive Difficulty - Unlocking System', () => {
  test('Tier 1 Level 1: only circles and squares, red color only', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(1));
    const colors = await page.evaluate(() => getUnlockedColors(1));

    expect(shapes).toEqual(['circle', 'square']);
    expect(colors).toEqual(['red']);
  });

  test('Tier 1 Level 3 (end): still 2 shapes and 1 color', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(3));
    const colors = await page.evaluate(() => getUnlockedColors(3));

    expect(shapes).toHaveLength(2);
    expect(shapes).toEqual(['circle', 'square']);
    expect(colors).toHaveLength(1);
    expect(colors).toEqual(['red']);
  });

  test('Tier 2 Level 4 (start): triangle unlocks, blue color added', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(4));
    const colors = await page.evaluate(() => getUnlockedColors(4));

    expect(shapes).toHaveLength(3);
    expect(shapes).toContain('triangle');
    expect(shapes).toEqual(['circle', 'square', 'triangle']);

    expect(colors).toHaveLength(2);
    expect(colors).toEqual(['red', 'blue']);
  });

  test('Tier 2 Level 6 (end): still 3 shapes and 2 colors', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(6));
    const colors = await page.evaluate(() => getUnlockedColors(6));

    expect(shapes).toHaveLength(3);
    expect(colors).toHaveLength(2);
  });

  test('Tier 3 Level 7 (start): 5 shapes (star, heart added), 4 colors', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(7));
    const colors = await page.evaluate(() => getUnlockedColors(7));

    expect(shapes).toHaveLength(5);
    expect(shapes).toContain('star');
    expect(shapes).toContain('heart');
    expect(shapes).toEqual(['circle', 'square', 'triangle', 'star', 'heart']);

    expect(colors).toHaveLength(4);
    expect(colors).toContain('green');
    expect(colors).toContain('yellow');
    expect(colors).toEqual(['red', 'blue', 'green', 'yellow']);
  });

  test('Tier 3 Level 9 (end): still 5 shapes and 4 colors', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(9));
    const colors = await page.evaluate(() => getUnlockedColors(9));

    expect(shapes).toHaveLength(5);
    expect(colors).toHaveLength(4);
  });

  test('Tier 4 Level 10 (start): 7 shapes (pentagon, hexagon added), 6 colors', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(10));
    const colors = await page.evaluate(() => getUnlockedColors(10));

    expect(shapes).toHaveLength(7);
    expect(shapes).toContain('pentagon');
    expect(shapes).toContain('hexagon');
    expect(shapes).toEqual(['circle', 'square', 'triangle', 'star', 'heart', 'pentagon', 'hexagon']);

    expect(colors).toHaveLength(6);
    expect(colors).toContain('purple');
    expect(colors).toContain('orange');
    expect(colors).toEqual(['red', 'blue', 'green', 'yellow', 'purple', 'orange']);
  });

  test('Tier 4 Level 12 (end): still 7 shapes and 6 colors', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(12));
    const colors = await page.evaluate(() => getUnlockedColors(12));

    expect(shapes).toHaveLength(7);
    expect(colors).toHaveLength(6);
  });

  test('Endless Level 13 (start): all 8 shapes, all 8 colors', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(13));
    const colors = await page.evaluate(() => getUnlockedColors(13));

    expect(shapes).toHaveLength(8);
    expect(shapes).toContain('diamond');
    expect(shapes).toEqual(['circle', 'square', 'triangle', 'star', 'heart', 'pentagon', 'hexagon', 'diamond']);

    expect(colors).toHaveLength(8);
    expect(colors).toContain('pink');
    expect(colors).toContain('cyan');
    expect(colors).toEqual(['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan']);
  });

  test('Endless Level 999 (deep endless): still all 8 shapes and colors', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const shapes = await page.evaluate(() => getUnlockedShapes(999));
    const colors = await page.evaluate(() => getUnlockedColors(999));

    expect(shapes).toHaveLength(8);
    expect(colors).toHaveLength(8);
  });

  test('Shape progression: 2 → 3 → 5 → 7 → 8', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const progression = await page.evaluate(() => ([
      getUnlockedShapes(1).length,   // 2
      getUnlockedShapes(4).length,   // 3
      getUnlockedShapes(7).length,   // 5
      getUnlockedShapes(10).length,  // 7
      getUnlockedShapes(13).length   // 8
    ]));

    expect(progression).toEqual([2, 3, 5, 7, 8]);
  });

  test('Color progression: 1 → 2 → 4 → 6 → 8', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const progression = await page.evaluate(() => ([
      getUnlockedColors(1).length,   // 1
      getUnlockedColors(4).length,   // 2
      getUnlockedColors(7).length,   // 4
      getUnlockedColors(10).length,  // 6
      getUnlockedColors(13).length   // 8
    ]));

    expect(progression).toEqual([1, 2, 4, 6, 8]);
  });

  test('No locked shapes appear in earlier tiers', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const tier1Shapes = await page.evaluate(() => getUnlockedShapes(1));

    // Tier 1 should NOT have triangle, star, heart, pentagon, hexagon, diamond
    expect(tier1Shapes).not.toContain('triangle');
    expect(tier1Shapes).not.toContain('star');
    expect(tier1Shapes).not.toContain('heart');
    expect(tier1Shapes).not.toContain('pentagon');
    expect(tier1Shapes).not.toContain('hexagon');
    expect(tier1Shapes).not.toContain('diamond');
  });
});
