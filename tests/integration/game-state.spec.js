import { test, expect } from '@playwright/test';
import { GamePage } from '../helpers/game-page.js';

test.describe('Game State Management', () => {
  test('initial state has levelCount = 1', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const state = await game.getGameState();
    expect(state.levelCount).toBe(1);
  });

  test('after generateLevel, gameState.slots is populated', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    await game.generateLevel(5);

    const state = await game.getGameState();
    expect(state.slotsCount).toBeGreaterThan(0);
  });

  test('slots initially have filled = false', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    await game.generateLevel(1);
    const slots = await game.getSlots();

    for (const slot of slots) {
      expect(slot.filled).toBe(false);
    }
  });

  test('generating new level clears previous slots and inventory', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Generate level 1
    await game.generateLevel(1);
    const state1 = await game.getGameState();
    const slots1 = await game.getSlots();
    const items1 = await game.getInventoryItems();

    expect(slots1).toHaveLength(1);
    expect(items1).toHaveLength(3);

    // Generate level 5 - should clear and regenerate
    await game.generateLevel(5);
    const state2 = await game.getGameState();
    const slots2 = await game.getSlots();
    const items2 = await game.getInventoryItems();

    expect(slots2).toHaveLength(2); // Not accumulated
    expect(items2).toHaveLength(4); // Not accumulated
  });

  test('intermissionCounter increments on level complete', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const initialCounter = await page.evaluate(() => gameState.intermissionCounter);
    expect(initialCounter).toBe(0);

    // Complete a level
    await game.generateLevel(1);
    await game.completeLevel();

    await page.waitForTimeout(2000);

    const newCounter = await page.evaluate(() => gameState.intermissionCounter);
    expect(newCounter).toBe(1);
  });

  test('isInIntermission flag toggles correctly', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const initialState = await page.evaluate(() => gameState.isInIntermission);
    expect(initialState).toBe(false);

    // Trigger intermission manually
    await page.evaluate(() => {
      triggerIntermission();
    });

    await page.waitForTimeout(500);

    const duringIntermission = await page.evaluate(() => gameState.isInIntermission);
    expect(duringIntermission).toBe(true);

    // End intermission
    await page.evaluate(() => {
      endIntermission();
    });

    await page.waitForTimeout(500);

    const afterIntermission = await page.evaluate(() => gameState.isInIntermission);
    expect(afterIntermission).toBe(false);
  });
});
