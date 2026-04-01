import { test, expect } from '@playwright/test';
import { GamePage } from '../helpers/game-page.js';

test.describe('Match Validation Logic', () => {
  test('exact match (shape + color + size) returns true', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const item = document.createElement('div');
      item.dataset.shape = 'circle';
      item.dataset.color = 'red';
      item.dataset.size = 'large';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'large';

      return validateMatch(item, slot);
    });

    expect(result).toBe(true);
  });

  test('wrong shape only returns false', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const item = document.createElement('div');
      item.dataset.shape = 'square';  // Wrong
      item.dataset.color = 'red';
      item.dataset.size = 'large';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'large';

      return validateMatch(item, slot);
    });

    expect(result).toBe(false);
  });

  test('wrong color only returns false', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const item = document.createElement('div');
      item.dataset.shape = 'circle';
      item.dataset.color = 'blue';  // Wrong
      item.dataset.size = 'large';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'large';

      return validateMatch(item, slot);
    });

    expect(result).toBe(false);
  });

  test('wrong size only returns false', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const item = document.createElement('div');
      item.dataset.shape = 'circle';
      item.dataset.color = 'red';
      item.dataset.size = 'small';  // Wrong

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'large';

      return validateMatch(item, slot);
    });

    expect(result).toBe(false);
  });

  test('multiple properties wrong returns false', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const item = document.createElement('div');
      item.dataset.shape = 'square';  // Wrong
      item.dataset.color = 'blue';    // Wrong
      item.dataset.size = 'large';

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'large';

      return validateMatch(item, slot);
    });

    expect(result).toBe(false);
  });

  test('all properties wrong returns false', async ({ page }) => {
    const game = new GamePage(page);
    await game.navigate();

    const result = await page.evaluate(() => {
      const item = document.createElement('div');
      item.dataset.shape = 'square';   // Wrong
      item.dataset.color = 'blue';     // Wrong
      item.dataset.size = 'small';     // Wrong

      const slot = document.createElement('div');
      slot.dataset.requiredShape = 'circle';
      slot.dataset.requiredColor = 'red';
      slot.dataset.requiredSize = 'large';

      return validateMatch(item, slot);
    });

    expect(result).toBe(false);
  });
});
