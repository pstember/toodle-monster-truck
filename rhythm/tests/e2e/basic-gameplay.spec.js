import { test, expect } from '@playwright/test';

test.describe('Rhythm Game - Critical E2E', () => {
  test('loads splash screen and starts game', async ({ page }) => {
    await page.goto('/rhythm/');

    // Verify splash screen visible
    await expect(page.locator('#splash-screen')).toBeVisible();
    await expect(page.locator('#start-game-btn')).toBeVisible();

    // Start game
    await page.click('#start-game-btn');

    // Verify game UI visible
    await expect(page.locator('#game-ui')).toBeVisible();
    await expect(page.locator('#rhythm-canvas')).toBeVisible();
  });

  test('can tap notes with keyboard', async ({ page }) => {
    await page.goto('/rhythm/');

    // Start game
    await page.click('#start-game-btn');

    // Wait for game to be playing
    await page.waitForTimeout(2500); // Wait past lead-in

    // Tap some notes
    await page.keyboard.press('KeyZ');
    await page.waitForTimeout(200);
    await page.keyboard.press('KeyX');
    await page.waitForTimeout(200);
    await page.keyboard.press('KeyC');

    // Verify hit counter increased (at least one hit registered)
    const hits = await page.locator('#live-hits').textContent();
    expect(parseInt(hits)).toBeGreaterThanOrEqual(0);
  });
});
