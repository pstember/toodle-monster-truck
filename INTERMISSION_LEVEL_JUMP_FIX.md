# Intermission Level Jump Bug Fix

## The Problem 🐛

**User Report**: "after doing a mini-game, I jump straight by 20-50 levels"

### What Was Happening

After completing a mini-game (especially Mud Wash), the user would jump from level 4 to level 50+ instead of just advancing to level 5.

### Root Cause

In the **Mud Wash** mini-game, the `clearMud()` function was called on every `mousemove` event while the user was drawing. The logic was:

```javascript
function clearMud(x, y) {
    // ... clear some mud ...
    pixelsCleared += Math.PI * 30 * 30;

    const percentCleared = (pixelsCleared / totalPixels) * 100;
    if (percentCleared >= 80) {
        setTimeout(() => {
            endIntermission();  // ❌ PROBLEM!
        }, 500);
    }
}
```

**The Issue:**
- `mousemove` events fire **very frequently** (30-60 times per second)
- Once the user hit 80% cleared, EVERY subsequent `mousemove` would schedule another call to `endIntermission()` after 500ms
- If the user kept drawing for even 1 second after hitting 80%, **30-60 calls to `endIntermission()` were queued**
- Each call to `endIntermission()` does: `gameState.levelCount++`
- Result: Level jumps from 4 → 54 (or worse!)

## The Fix ✅

Added a `gameEnding` flag to prevent multiple calls to `endIntermission()`:

### Mud Wash Game (script.js lines 577-612)

```javascript
function startMudWashGame() {
    // ... setup ...

    let gameEnding = false; // ✅ NEW: Prevent multiple calls

    function clearMud(x, y) {
        // ... clear mud ...

        const percentCleared = (pixelsCleared / totalPixels) * 100;
        if (percentCleared >= 80 && !gameEnding) {  // ✅ Check flag
            gameEnding = true;  // ✅ Set flag immediately
            setTimeout(() => {
                endIntermission();
            }, 500);
        }
    }
}
```

### Sticker Shop Game (script.js lines 643-671)

Also added protection against double-clicks on the DONE button:

```javascript
function startStickerShopGame() {
    // ... setup ...

    let gameEnding = false; // ✅ NEW: Prevent double-clicks

    const doneBtn = document.getElementById('sticker-done-btn');
    doneBtn.onclick = () => {
        if (!gameEnding) {  // ✅ Check flag
            gameEnding = true;  // ✅ Set flag
            playSound('sticker');
            endIntermission();
        }
    };
}
```

### Big Jump Game

Already had protection with `hasJumped` flag - no changes needed.

## How It Works Now

### Mud Wash Sequence
1. User draws on canvas → `clearMud()` called repeatedly
2. When 80% cleared → `gameEnding = true` immediately
3. Schedule `endIntermission()` after 500ms
4. User keeps drawing → `clearMud()` still called
5. But `gameEnding === true` → no more calls scheduled ✅
6. Only ONE call to `endIntermission()` → level increments by 1

### Sticker Shop Sequence
1. User clicks DONE → `gameEnding = true` immediately
2. Call `endIntermission()`
3. If user double-clicks → second click does nothing ✅
4. Only ONE call to `endIntermission()` → level increments by 1

## Testing

```bash
# Play through to level 3, complete it, play mud wash mini-game
# Level should go: 3 → 4 (not 3 → 50+)

# Manual test:
open http://localhost:3000/index.html
# Complete levels 1, 2, 3
# Do mud wash mini-game (draw a lot, keep drawing after truck is clean)
# Verify level goes to 4, not 40+

# Automated test:
npx playwright test tests/e2e/intermission-level-jump-test.spec.js
```

## Files Changed

1. **script.js** (Mud Wash - lines 577-612):
   - Added `let gameEnding = false;`
   - Changed condition to `if (percentCleared >= 80 && !gameEnding)`
   - Set `gameEnding = true;` before scheduling `endIntermission()`

2. **script.js** (Sticker Shop - lines 643-671):
   - Added `let gameEnding = false;`
   - Wrapped button onclick with `if (!gameEnding)` check
   - Set `gameEnding = true;` before calling `endIntermission()`

## Why This Matters

The original bug made the game progression completely broken. A user playing through the game would:
1. Complete levels 1, 2, 3 normally
2. Play the mud wash mini-game
3. Suddenly jump to level 50+
4. Game becomes unplayable due to impossibly high difficulty

**Now:** Each mini-game completion increments the level by exactly 1, as intended.

---

**Status**: FIXED - Mini-games now advance exactly 1 level! 🎮
