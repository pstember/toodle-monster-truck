// ===================================
// UTILITY FUNCTIONS MODULE
// ===================================

/**
 * Plays a sound effect (placeholder for future implementation)
 * @param {string} soundName - Name of the sound to play
 */
export function playSound(soundName) {
    // Future implementation:
    // try {
    //     const audio = new Audio(`sounds/${soundName}.mp3`);
    //     audio.play().catch(err => console.error('Failed to play sound:', err));
    // } catch (error) {
    //     console.error('Sound playback error:', error);
    // }
}

/**
 * Safely clears all child nodes from a container
 * @param {HTMLElement} container - The container to clear
 */
export function clearContainer(container) {
    if (!container) return;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
