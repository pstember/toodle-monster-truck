import { test, expect } from '@playwright/test';
import { GamePage } from '../helpers/game-page.js';

test.describe('Progressive Difficulty E2E', () => {
  test('levels 1-3 only show circles/squares in red', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Test level 1
    await game.generateLevel(1);
    let items = await game.getInventoryItems();
    let slots = await game.getSlots();

    for (const item of items) {
      expect(['circle', 'square']).toContain(item.shape);
      expect(item.color).toBe('red');
    }

    for (const slot of slots) {
      expect(['circle', 'square']).toContain(slot.shape);
      expect(slot.color).toBe('red');
    }

    // Test level 3
    await game.generateLevel(3);
    items = await game.getInventoryItems();
    slots = await game.getSlots();

    for (const item of items) {
      expect(['circle', 'square']).toContain(item.shape);
      expect(item.color).toBe('red');
    }
  });

  test('level 4 shows triangles and blue color', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    await game.generateLevel(4);
    const items = await game.getInventoryItems();
    const slots = await game.getSlots();

    // Collect all shapes and colors
    const allShapes = [...items, ...slots].map(x => x.shape);
    const allColors = [...items, ...slots].map(x => x.color);

    // Should have access to triangle
    const validShapes = ['circle', 'square', 'triangle'];
    for (const shape of allShapes) {
      expect(validShapes).toContain(shape);
    }

    // Should have access to red and blue
    const validColors = ['red', 'blue'];
    for (const color of allColors) {
      expect(validColors).toContain(color);
    }
  });

  test('level 10 shows size variations', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    await game.generateLevel(10);
    const items = await game.getInventoryItems();
    const slots = await game.getSlots();

    const allSizes = [...items, ...slots].map(x => x.size);

    // At level 10, size variations are enabled
    // Should have both large and small (statistically very likely with 9 items total)
    const uniqueSizes = [...new Set(allSizes)];
    expect(uniqueSizes.length).toBeGreaterThan(1);
  });

  test('level 13+ has all shapes and colors available', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    await game.generateLevel(13);

    // Verify unlocking system allows all 8 shapes and 8 colors
    const unlockedShapes = await page.evaluate(() => getUnlockedShapes(13));
    const unlockedColors = await page.evaluate(() => getUnlockedColors(13));

    expect(unlockedShapes).toHaveLength(8);
    expect(unlockedColors).toHaveLength(8);

    // Verify items can use any shape/color
    const items = await game.getInventoryItems();

    for (const item of items) {
      expect(unlockedShapes).toContain(item.shape);
      expect(unlockedColors).toContain(item.color);
    }
  });
});
