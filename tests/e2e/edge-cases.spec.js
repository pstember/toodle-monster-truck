import { test, expect } from '@playwright/test';
import { GamePage } from '../helpers/game-page.js';

test.describe('Edge Cases and Boundary Conditions', () => {
  test('rapid clicking does not break drag state', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const item = page.locator('.draggable-item').first();

    // Rapidly click item multiple times
    for (let i = 0; i < 5; i++) {
      await item.click();
      await page.waitForTimeout(50);
    }

    // Verify game is still functional
    const itemsCount = await page.locator('.draggable-item').count();
    expect(itemsCount).toBe(2); // Should still have 2 items (Level 1 limit)

    // Verify drag still works
    const correctIndex = await game.findCorrectMatchIndex(0);
    await game.dragItemToSlot(correctIndex, 0);

    const slot = page.locator('.slot').first();
    await expect(slot).toHaveClass(/filled/);
  });

  test('zero-movement drag returns item correctly', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const item = page.locator('.draggable-item').first();
    const itemsBefore = await page.locator('.draggable-item').count();

    // Simulate a drag with minimal movement
    const itemBox = await item.boundingBox();
    await page.mouse.move(itemBox.x + itemBox.width / 2, itemBox.y + itemBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(itemBox.x + itemBox.width / 2 + 2, itemBox.y + itemBox.height / 2 + 2); // Move 2px
    await page.mouse.up();

    // Verify item is still there
    const itemsAfter = await page.locator('.draggable-item').count();
    expect(itemsAfter).toBe(itemsBefore);
  });

  test('every level has at least one correct match', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Test multiple random levels
    const levelsToTest = [1, 3, 5, 7, 10, 13, 20];

    for (const level of levelsToTest) {
      await game.generateLevel(level);

      const slots = await game.getSlots();
      const items = await game.getInventoryItems();

      // For each slot, verify there's at least one matching item
      for (const slot of slots) {
        const hasMatch = items.some(item =>
          item.shape === slot.shape &&
          item.color === slot.color &&
          item.size === slot.size
        );

        expect(hasMatch).toBe(true);
      }
    }
  });

  test('intermission counter tracks multiple cycles', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Complete 6 levels to trigger 2 intermissions
    for (let level = 1; level <= 6; level++) {
      // Only generate the first level; others auto-generate after completion
      if (level === 1) {
        await game.generateLevel(level);
      }

      await game.completeLevel();

      if (level === 3 || level === 6) {
        // Intermission should trigger
        await page.waitForTimeout(3000);

        // Force end intermission to continue
        await page.evaluate(() => {
          if (gameState.isInIntermission) {
            endIntermission();
          }
        });

        await page.waitForTimeout(1000);
      } else {
        // Wait for next level to auto-generate
        await page.waitForTimeout(2000);
      }
    }

    // Verify counter is at 6
    const counter = await page.evaluate(() => gameState.intermissionCounter);
    expect(counter).toBe(6);
  });

  test('confetti does not accumulate in DOM', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Complete first level
    await game.generateLevel(1);
    await game.completeLevel();

    await page.waitForTimeout(1500);

    const confettiAfterFirst = await page.locator('.confetti').count();

    // Wait for confetti to clear
    await page.waitForTimeout(2000);

    const confettiAfterClear = await page.locator('.confetti').count();

    // Confetti should be cleared (or minimal)
    expect(confettiAfterClear).toBeLessThan(confettiAfterFirst);
  });

  test('no duplicate items in inventory', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Test multiple levels to ensure duplicate prevention works
    const levelsToTest = [5, 10, 15];

    for (const level of levelsToTest) {
      await game.generateLevel(level);
      const items = await game.getInventoryItems();

      // Check for duplicates
      const seen = new Set();
      for (const item of items) {
        const key = `${item.shape}-${item.color}-${item.size}`;
        expect(seen.has(key)).toBe(false); // No duplicates
        seen.add(key);
      }
    }
  });

  test('exactly one correct match per slot exists', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Test across multiple levels
    const levelsToTest = [5, 10, 15];

    for (const level of levelsToTest) {
      await game.generateLevel(level);

      const slots = await game.getSlots();
      const items = await game.getInventoryItems();

      for (const slot of slots) {
        const matches = items.filter(item =>
          item.shape === slot.shape &&
          item.color === slot.color &&
          item.size === slot.size
        );

        expect(matches).toHaveLength(1); // Exactly one match
      }
    }
  });
});
