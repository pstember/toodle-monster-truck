// ===================================
// BUBBLE WRAP MINI-GAME MODULE
// ===================================

import {
    BREAKPOINT_TABLET,
    BREAKPOINT_MOBILE,
    BUBBLE_GRID_SMALL,
    BUBBLE_GRID_MOBILE,
    BUBBLE_GRID_DEFAULT
} from '../constants.js';
import { playSound, clearContainer } from '../utils.js';

/**
 * Determines bubble grid size based on screen size
 * @returns {Object} Grid configuration with rows and cols
 */
function getBubbleGridSize() {
    const isMobile = window.innerWidth <= BREAKPOINT_TABLET;
    const isSmallMobile = window.innerWidth <= BREAKPOINT_MOBILE;

    if (isSmallMobile) {
        return BUBBLE_GRID_SMALL;
    } else if (isMobile) {
        return BUBBLE_GRID_MOBILE;
    } else {
        return BUBBLE_GRID_DEFAULT;
    }
}

/**
 * Creates a single bubble element with click handler
 * @param {number} index - Bubble index
 * @param {Object} state - Shared state object with poppedCount
 * @param {number} totalBubbles - Total number of bubbles
 * @param {HTMLElement} counterElement - Element to update with count
 * @returns {HTMLElement} Bubble element
 */
function createBubble(index, state, totalBubbles, counterElement) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.dataset.index = index;

    bubble.onclick = () => {
        if (!bubble.classList.contains('popped')) {
            bubble.classList.add('popped');
            state.poppedCount++;
            counterElement.textContent = state.poppedCount;
            playSound('pop');

            // Check if all bubbles are popped
            if (state.poppedCount === totalBubbles) {
                setTimeout(() => {
                    playSound('success');
                    import('../visual-effects.js').then(({ endIntermission }) => {
                        endIntermission();
                    });
                }, 500);
            }
        }
    };

    return bubble;
}

/**
 * Starts the bubble wrap mini-game
 */
export function startBubbleWrapGame() {
    const game = document.getElementById('bubble-wrap-game');
    game.classList.remove('hidden');

    const bubbleGrid = document.getElementById('bubble-grid');
    const bubblesPopped = document.getElementById('bubbles-popped');
    const bubblesTotal = document.getElementById('bubbles-total');

    const gridSize = getBubbleGridSize();
    const totalBubbles = gridSize.rows * gridSize.cols;
    const state = { poppedCount: 0 };

    // Update grid layout
    bubbleGrid.style.gridTemplateRows = `repeat(${gridSize.rows}, 1fr)`;
    bubbleGrid.style.gridTemplateColumns = `repeat(${gridSize.cols}, 1fr)`;

    // Update counters
    bubblesTotal.textContent = totalBubbles;
    bubblesPopped.textContent = '0';

    // Clear and create bubbles
    clearContainer(bubbleGrid);
    for (let i = 0; i < totalBubbles; i++) {
        const bubble = createBubble(i, state, totalBubbles, bubblesPopped);
        bubbleGrid.appendChild(bubble);
    }
}
