import { test, expect } from '@playwright/test';
import { GamePage } from '../helpers/game-page.js';

test.describe('Basic Gameplay Flow', () => {
  test('game loads showing Level 1', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const levelNumber = await page.locator('#level-number').textContent();
    expect(levelNumber).toBe('1');

    const slots = await page.locator('.slot').count();
    expect(slots).toBe(1);

    const items = await page.locator('.draggable-item').count();
    // Level 1 now has 2 items (not 3) to prevent duplicates
    expect(items).toBe(2);
  });

  test('dragging correct item to slot succeeds', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Capture console logs
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    // Find correct match
    const correctIndex = await game.findCorrectMatchIndex(0);
    expect(correctIndex).toBeGreaterThanOrEqual(0);

    // Drag correct item to slot
    await game.dragItemToSlot(correctIndex, 0);

    // Verify slot is filled
    const slot = page.locator('.slot').first();
    await expect(slot).toHaveClass(/filled/);

    // Verify item was removed from inventory
    // Note: Items in slots are also .draggable-item, so check inventory container specifically
    const itemsAfter = await page.locator('.inventory-items .draggable-item').count();
    expect(itemsAfter).toBe(1); // Started with 2, now 1
  });

  test('filling all slots triggers level complete', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Complete the level
    await game.completeLevel();

    // Verify truck drives off
    const truck = page.locator('#monster-truck');
    await expect(truck).toHaveClass(/driving-off/);

    // Verify confetti container has confetti
    const confetti = await page.locator('.confetti').count();
    expect(confetti).toBeGreaterThan(0);
  });

  test('next level auto-generates after completion', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    // Complete level 1
    await game.completeLevel();

    // Wait for level to advance
    await game.waitForLevel(2);

    const levelNumber = await page.locator('#level-number').textContent();
    expect(levelNumber).toBe('2');

    // Verify new level is generated
    const slots = await page.locator('.slot').count();
    expect(slots).toBeGreaterThanOrEqual(1);
  });
});
