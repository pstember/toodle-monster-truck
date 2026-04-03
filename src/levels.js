// ===================================
// LEVEL GENERATION MODULE
// ===================================

import {
    SLOT_SIZE_LARGE,
    SLOT_SIZE_SMALL,
    TIER_THRESHOLDS,
    TIER_CONFIG
} from './constants.js';
import { gameState, ALL_SHAPES, ALL_COLORS } from './state.js';
import { clearContainer, shuffleArray } from './utils.js';

/**
 * Get unlocked shapes based on current level
 * @param {number} level - Current level number
 * @returns {string[]} Array of unlocked shape names
 */
export function getUnlockedShapes(level) {
    if (level <= TIER_THRESHOLDS.TIER_1) {
        return ['circle', 'square']; // Tier 1: 2 shapes
    } else if (level <= TIER_THRESHOLDS.TIER_2) {
        return ['circle', 'square', 'triangle']; // Tier 2: 3 shapes
    } else if (level <= TIER_THRESHOLDS.TIER_3) {
        return ['circle', 'square', 'triangle', 'star', 'heart']; // Tier 3: 5 shapes
    } else if (level <= TIER_THRESHOLDS.TIER_4) {
        return ['circle', 'square', 'triangle', 'star', 'heart', 'pentagon', 'hexagon']; // Tier 4: 7 shapes
    } else {
        return ALL_SHAPES; // Endless: all 8 shapes
    }
}

/**
 * Get unlocked colors based on current level
 * @param {number} level - Current level number
 * @returns {string[]} Array of unlocked color names
 */
export function getUnlockedColors(level) {
    if (level <= TIER_THRESHOLDS.TIER_1) {
        return ['red']; // Tier 1: 1 color
    } else if (level <= TIER_THRESHOLDS.TIER_2) {
        return ['red', 'blue']; // Tier 2: 2 colors
    } else if (level <= TIER_THRESHOLDS.TIER_3) {
        return ['red', 'blue', 'green', 'yellow']; // Tier 3: 4 colors
    } else if (level <= TIER_THRESHOLDS.TIER_4) {
        return ['red', 'blue', 'green', 'yellow', 'purple', 'orange']; // Tier 4: 6 colors
    } else {
        return ALL_COLORS; // Endless: all 10 colors (includes pink, cyan, brown, lime)
    }
}

/**
 * Creates a slot element for a specific shape, color, and size
 * @param {string} shape - Shape name
 * @param {string} color - Color name
 * @param {string} size - Size ('large' or 'small')
 * @param {Function} handleDragStart - Drag start handler
 * @returns {HTMLElement} Slot element
 */
export function createSlot(shape, color, size) {
    const slot = document.createElement('div');
    slot.className = `slot size-${size}`;
    slot.dataset.requiredShape = shape;
    slot.dataset.requiredColor = color;
    slot.dataset.requiredSize = size;

    // ARIA accessibility
    slot.setAttribute('role', 'button');
    slot.setAttribute('aria-label', `Drop zone for ${size} ${color} ${shape}`);
    slot.setAttribute('tabindex', '0');

    // Set size based on size parameter
    const slotSize = size === 'large' ? SLOT_SIZE_LARGE : SLOT_SIZE_SMALL;
    slot.style.width = `${slotSize}px`;
    slot.style.height = `${slotSize}px`;

    // Add visual outline showing what shape is needed
    const outline = document.createElement('div');
    outline.className = `slot-outline shape ${shape} color-${color} size-${size}`;
    outline.dataset.shape = shape;
    outline.dataset.color = color;
    outline.dataset.size = size;
    slot.appendChild(outline);

    return slot;
}

/**
 * Creates a draggable item element
 * @param {string} shape - Shape name
 * @param {string} color - Color name
 * @param {string} size - Size ('large' or 'small')
 * @param {Function} handleDragStart - Drag start handler
 * @returns {HTMLElement} Draggable item element
 */
export function createDraggableItem(shape, color, size, handleDragStart) {
    const item = document.createElement('div');
    item.className = `draggable-item shape ${shape} color-${color} size-${size}`;
    item.dataset.shape = shape;
    item.dataset.color = color;
    item.dataset.size = size;

    // ARIA accessibility
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Draggable ${size} ${color} ${shape}`);
    item.setAttribute('aria-grabbed', 'false');
    item.setAttribute('tabindex', '0');

    // Store original position
    setTimeout(() => {
        const rect = item.getBoundingClientRect();
        item.dataset.originalX = rect.left;
        item.dataset.originalY = rect.top;
    }, 0);

    // Add event listeners
    item.addEventListener('mousedown', handleDragStart);
    item.addEventListener('touchstart', handleDragStart);

    return item;
}

/**
 * Generates a new level with slots and inventory items
 * @param {number} level - Level number to generate
 * @param {Function} handleDragStart - Drag start handler to attach to items
 */
export function generateLevel(level, handleDragStart) {
    try {
        // Reset level completing flag for new level
        gameState.levelCompleting = false;

        const unlockedShapes = getUnlockedShapes(level);
        const unlockedColors = getUnlockedColors(level);

        let numTargets, numInventory, useSize;

        // Tier logic
        if (level <= TIER_THRESHOLDS.TIER_1) {
            numTargets = TIER_CONFIG.TIER_1.numTargets;
            numInventory = TIER_CONFIG.TIER_1.numInventory;
            useSize = TIER_CONFIG.TIER_1.useSize;
        } else if (level <= TIER_THRESHOLDS.TIER_2) {
            numTargets = TIER_CONFIG.TIER_2.numTargets;
            numInventory = TIER_CONFIG.TIER_2.numInventory;
            useSize = TIER_CONFIG.TIER_2.useSize;
        } else if (level <= TIER_THRESHOLDS.TIER_3) {
            numTargets = TIER_CONFIG.TIER_3.numTargetsMin + Math.floor(Math.random() * (TIER_CONFIG.TIER_3.numTargetsMax - TIER_CONFIG.TIER_3.numTargetsMin + 1));
            numInventory = TIER_CONFIG.TIER_3.numInventory;
            useSize = TIER_CONFIG.TIER_3.useSize;
        } else if (level <= TIER_THRESHOLDS.TIER_4) {
            numTargets = TIER_CONFIG.TIER_4.numTargets;
            numInventory = TIER_CONFIG.TIER_4.numInventory;
            useSize = TIER_CONFIG.TIER_4.useSize;
        } else {
            // Endless mode: randomize difficulty
            numTargets = TIER_CONFIG.ENDLESS.numTargetsMin + Math.floor(Math.random() * (TIER_CONFIG.ENDLESS.numTargetsMax - TIER_CONFIG.ENDLESS.numTargetsMin + 1));
            numInventory = TIER_CONFIG.ENDLESS.numInventoryMin + Math.floor(Math.random() * (TIER_CONFIG.ENDLESS.numInventoryMax - TIER_CONFIG.ENDLESS.numInventoryMin + 1));
            useSize = Math.random() > TIER_CONFIG.ENDLESS.useSizeChance;
        }

        // Clear previous level
        gameState.slots = [];
        gameState.inventory = [];

        const slotsContainer = document.getElementById('slots-container');
        const inventoryContainer = document.getElementById('inventory-items');

        if (!slotsContainer || !inventoryContainer) {
            console.error('Failed to find game containers');
            return;
        }

        clearContainer(slotsContainer);
        clearContainer(inventoryContainer);

        // Generate target slots (ensure no duplicate slot requirements)
        const slotRequirements = [];
        for (let i = 0; i < numTargets; i++) {
            let targetShape, targetColor, targetSize;
            let attempts = 0;
            const maxAttempts = 100;

            // Keep generating until we get a unique slot requirement
            do {
                targetShape = unlockedShapes[Math.floor(Math.random() * unlockedShapes.length)];
                targetColor = unlockedColors[Math.floor(Math.random() * unlockedColors.length)];
                targetSize = useSize ? (Math.random() > 0.5 ? 'large' : 'small') : 'large';
                attempts++;

                // Prevent infinite loop if pool is too small
                if (attempts >= maxAttempts) break;

            } while (slotRequirements.some(req =>
                req.shape === targetShape &&
                req.color === targetColor &&
                req.size === targetSize
            ));

            slotRequirements.push({ shape: targetShape, color: targetColor, size: targetSize });

            const slot = createSlot(targetShape, targetColor, targetSize);
            slotsContainer.appendChild(slot);
            gameState.slots.push({ shape: targetShape, color: targetColor, size: targetSize, filled: false, element: slot });
        }

        // Generate inventory items (correct + distractors)
        const inventoryItems = [];

        // Add correct items (one per unique slot requirement)
        slotRequirements.forEach(req => {
            inventoryItems.push({ shape: req.shape, color: req.color, size: req.size });
        });

        // Calculate maximum possible unique items
        const possibleSizes = useSize ? 2 : 1;
        const maxUniqueItems = unlockedShapes.length * unlockedColors.length * possibleSizes;

        // Adjust inventory size if we don't have enough unique combinations
        const safeInventorySize = Math.min(numInventory, maxUniqueItems);
        const numDistractors = safeInventorySize - numTargets;

        // Add distractor items (ensure no duplicates)
        for (let i = 0; i < numDistractors; i++) {
            let distractor;
            let attempts = 0;
            const maxAttempts = 100;

            do {
                const shape = unlockedShapes[Math.floor(Math.random() * unlockedShapes.length)];
                const color = unlockedColors[Math.floor(Math.random() * unlockedColors.length)];
                const size = useSize ? (Math.random() > 0.5 ? 'large' : 'small') : 'large';
                distractor = { shape, color, size };
                attempts++;

                // Prevent infinite loop if pool is too small
                if (attempts >= maxAttempts) {
                    console.error('Failed to generate unique distractor - skipping');
                    break;
                }

            } while (inventoryItems.some(item =>
                item.shape === distractor.shape &&
                item.color === distractor.color &&
                item.size === distractor.size
            ));

            // Only add if we successfully generated a unique item
            if (attempts < maxAttempts) {
                inventoryItems.push(distractor);
            }
        }

        // Shuffle inventory
        shuffleArray(inventoryItems);

        // Render inventory
        inventoryItems.forEach(item => {
            const draggable = createDraggableItem(item.shape, item.color, item.size, handleDragStart);
            inventoryContainer.appendChild(draggable);
        });

        // Update level display
        const levelNumber = document.getElementById('level-number');
        if (levelNumber) {
            levelNumber.textContent = level;
        }

        // Reset truck position
        const truck = document.getElementById('monster-truck');
        if (truck) {
            truck.classList.remove('driving-off');
            truck.style.transform = '';
        }

    } catch (error) {
        console.error('Failed to generate level:', error);
        // Try to recover by reloading the page
        const shouldReload = confirm('An error occurred. Would you like to reload the game?');
        if (shouldReload) {
            window.location.reload();
        }
    }
}
