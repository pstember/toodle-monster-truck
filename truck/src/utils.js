// ===================================
// UTILITY FUNCTIONS MODULE
// ===================================

/**
 * Lazy-initialized audio context for system sounds
 * @type {AudioContext | null}
 */
let audioCtx = null;

/**
 * Get or create audio context
 * @returns {AudioContext | null}
 */
function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    return audioCtx;
}

/**
 * Plays a system sound effect using Web Audio API
 * @param {string} soundName - Name of the sound to play ('success', 'tryAgain', 'levelComplete', 'tierComplete')
 */
export function playSound(soundName) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (soundName) {
            case 'success':
                // Happy ascending tone
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;

            case 'tryAgain':
                // Lower descending tone
                osc.frequency.setValueAtTime(329.63, now); // E4
                osc.frequency.exponentialRampToValueAtTime(246.94, now + 0.12); // B3
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;

            case 'levelComplete':
                // Cheerful arpeggio
                [523.25, 659.25, 783.99].forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(0.25, now + i * 0.08);
                    g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
                    o.start(now + i * 0.08);
                    o.stop(now + i * 0.08 + 0.2);
                });
                break;

            case 'tierComplete':
                // Triumphant fanfare
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(0.3, now + i * 0.1);
                    g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
                    o.start(now + i * 0.1);
                    o.stop(now + i * 0.1 + 0.3);
                });
                break;

            default:
                // Generic beep
                osc.frequency.value = 440;
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
        }
    } catch (error) {
        // Silently fail - sound is not critical
    }
}

/**
 * Safely clears all child nodes from a container
 * @param {HTMLElement} container - The container to clear
 */
export function clearContainer(container) {
    if (!container) return;
    container.replaceChildren();
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
