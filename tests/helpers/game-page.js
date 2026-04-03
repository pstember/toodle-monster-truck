/**
 * GamePage Helper - Shared utilities for testing the toddler truck game
 */
export class GamePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to the game and wait for it to load
   */
  async navigate() {
    await this.page.goto('/index.html');
    await this.page.waitForLoadState('domcontentloaded');

    // Disable animations for stable testing
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });

    // Wait for game to initialize
    await this.page.waitForTimeout(100);

    // Click start button to begin game
    await this.page.click('#start-game-btn');

    // Wait for level 1 to generate
    await this.page.waitForTimeout(200);
  }

  /**
   * Reset game state to initial values
   */
  async resetGameState() {
    await this.page.evaluate(() => {
      gameState.levelCount = 1;
      gameState.intermissionCounter = 0;
      gameState.currentDragItem = null;
      gameState.dragOffset = { x: 0, y: 0 };
      gameState.slots = [];
      gameState.inventory = [];
      gameState.isInIntermission = false;
    });
  }

  /**
   * Generate a specific level
   * @param {number} level - Level number to generate
   */
  async generateLevel(level) {
    await this.page.evaluate((lvl) => generateLevel(lvl), level);
    await this.page.waitForTimeout(200); // Wait for DOM updates
  }

  /**
   * Get all slots with their properties
   * @returns {Promise<Array>} Array of slot objects
   */
  async getSlots() {
    return await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('.slot')).map(slot => ({
        shape: slot.dataset.requiredShape,
        color: slot.dataset.requiredColor,
        size: slot.dataset.requiredSize,
        filled: slot.classList.contains('filled')
      }));
    });
  }

  /**
   * Get all inventory items with their properties
   * @returns {Promise<Array>} Array of item objects
   */
  async getInventoryItems() {
    return await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('.draggable-item')).map(item => ({
        shape: item.dataset.shape,
        color: item.dataset.color,
        size: item.dataset.size
      }));
    });
  }

  /**
   * Get current game state
   * @returns {Promise<Object>} Game state object
   */
  async getGameState() {
    return await this.page.evaluate(() => ({
      levelCount: gameState.levelCount,
      intermissionCounter: gameState.intermissionCounter,
      isInIntermission: gameState.isInIntermission,
      slotsCount: gameState.slots.length
    }));
  }

  /**
   * Drag an inventory item to a slot
   * @param {number} itemIndex - Index of the inventory item
   * @param {number} slotIndex - Index of the target slot
   */
  async dragItemToSlot(itemIndex, slotIndex) {
    const item = this.page.locator('.draggable-item').nth(itemIndex);
    const slot = this.page.locator('.slot').nth(slotIndex);

    // Ensure elements are visible before dragging
    await item.waitFor({ state: 'visible', timeout: 5000 });
    await slot.waitFor({ state: 'visible', timeout: 5000 });

    // Use dragTo with force option since animations are disabled
    // This bypasses actionability checks while still triggering proper events
    await item.dragTo(slot, {
      force: true,
      timeout: 10000
    });

    // Wait for DOM updates
    await this.page.waitForTimeout(200);
  }

  /**
   * Find the index of a correct match for a given slot
   * @param {number} slotIndex - Index of the slot
   * @returns {Promise<number>} Index of matching item, or -1 if not found
   */
  async findCorrectMatchIndex(slotIndex) {
    const slots = await this.getSlots();
    const items = await this.getInventoryItems();

    const targetSlot = slots[slotIndex];

    return items.findIndex(item =>
      item.shape === targetSlot.shape &&
      item.color === targetSlot.color &&
      item.size === targetSlot.size
    );
  }

  /**
   * Find the index of an incorrect match for a given slot
   * @param {number} slotIndex - Index of the slot
   * @returns {Promise<number>} Index of non-matching item, or -1 if not found
   */
  async findIncorrectMatchIndex(slotIndex) {
    const slots = await this.getSlots();
    const items = await this.getInventoryItems();

    const targetSlot = slots[slotIndex];

    return items.findIndex(item =>
      item.shape !== targetSlot.shape ||
      item.color !== targetSlot.color ||
      item.size !== targetSlot.size
    );
  }

  /**
   * Complete a full level by dragging all correct items
   */
  async completeLevel() {
    const slots = await this.getSlots();

    for (let i = 0; i < slots.length; i++) {
      const matchIndex = await this.findCorrectMatchIndex(i);
      if (matchIndex >= 0) {
        await this.dragItemToSlot(matchIndex, i);
      }
    }

    // Reduced wait since animations are disabled
    await this.page.waitForTimeout(500);
  }

  /**
   * Wait for level number to change
   * @param {number} expectedLevel - Expected level number
   */
  async waitForLevel(expectedLevel) {
    await this.page.waitForFunction(
      (expected) => {
        const levelText = document.getElementById('level-number').textContent;
        return parseInt(levelText) === expected;
      },
      expectedLevel,
      { timeout: 5000 }
    );
  }

  /**
   * Override Math.random to force deterministic behavior
   * @param {number} value - Value to return (0-1)
   */
  async setMathRandom(value) {
    await this.page.evaluate((val) => {
      Math.random = () => val;
    }, value);
  }
}
