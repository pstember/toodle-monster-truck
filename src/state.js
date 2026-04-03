// ===================================
// GAME STATE MODULE
// ===================================

export const gameState = {
    levelCount: 1,
    intermissionCounter: 0,
    currentDragItem: null,
    dragOffset: { x: 0, y: 0 },
    slots: [],
    inventory: [],
    isInIntermission: false,
    levelCompleting: false, // Guard to prevent race condition in checkLevelComplete
    rafId: null, // requestAnimationFrame ID for drag updates
    currentHoverSlot: null, // Track currently highlighted slot to avoid unnecessary DOM updates
    slotRects: [] // Cached slot positions for fast collision detection during drag
};

// ===================================
// DATA POOLS
// ===================================

export const ALL_SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'pentagon', 'hexagon', 'diamond'];
export const ALL_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
export const SIZES = ['large', 'small'];
