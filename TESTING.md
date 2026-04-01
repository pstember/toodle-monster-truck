# Testing Checklist

## Pre-Launch Testing

### Desktop Browser Testing
- [ ] Open `index.html` in Chrome
- [ ] Open `index.html` in Firefox
- [ ] Open `index.html` in Safari
- [ ] Verify game loads without console errors
- [ ] Test mouse drag-and-drop works smoothly

### Mobile Device Testing (CRITICAL)
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Verify landscape orientation prompt appears in portrait mode
- [ ] Confirm touch targets are easy to tap (≥80px)
- [ ] Test drag-and-drop with touch gestures
- [ ] Verify no accidental scrolling during drag
- [ ] Check that pinch-zoom is disabled

## Gameplay Testing

### Level Progression
- [ ] **Levels 1-3:** Only circles and squares appear (red only)
- [ ] **Levels 4-6:** Triangles added, blue color introduced
- [ ] **Levels 7-9:** Stars and hearts added, green and yellow appear
- [ ] **Levels 10-12:** Size sorting introduced (Papa/Baby truck)
- [ ] **Level 13+:** All shapes and colors appear

### Core Mechanics
- [ ] Correct matches snap into place with animation
- [ ] Wrong matches bounce back gently (no negative feedback)
- [ ] Audio placeholder logs appear in console
- [ ] Level counter updates correctly
- [ ] Truck drives off when level completes
- [ ] Confetti appears on level complete

### Intermission Games
Test after completing 3 levels:

- [ ] **Mud Wash Game:**
  - Canvas appears with brown overlay
  - Dragging clears the mud
  - Game ends at ~80% cleared
  - Returns to main game

- [ ] **Sticker Shop Game:**
  - 5 emoji stickers appear
  - Stickers can be dragged freely
  - "DONE!" button works
  - Returns to main game

- [ ] **Big Jump Game:**
  - Truck drives to ramp automatically
  - "JUMP!" button is huge and easy to tap
  - Truck does backflip animation
  - Fireworks appear
  - Returns to main game

## Performance Testing

- [ ] Drag-and-drop feels smooth (60fps)
- [ ] No lag during confetti animation
- [ ] Canvas eraser performs well on mobile
- [ ] No memory leaks during extended play

## User Experience Testing (with Target User)

- [ ] Child can successfully drag items
- [ ] Touch targets are large enough
- [ ] Wrong matches don't cause frustration
- [ ] Intermissions provide good breaks
- [ ] Child remains engaged for 10+ minutes
- [ ] No accidental exits or browser actions

## Known Issues to Monitor

1. **Touch conflicts:** May conflict with browser gestures on some devices
2. **Canvas performance:** Mud wash game may be slow on older devices
3. **CSS shapes:** Triangle/heart shapes may render differently across browsers
4. **Landscape mode:** Some devices may not show rotation prompt correctly

## Adding Sound Files

When ready to add real sounds:

1. Create a `sounds/` directory
2. Add these files:
   - `success.mp3` - Happy chime
   - `tryAgain.mp3` - Gentle boing
   - `levelComplete.mp3` - Truck engine sound
   - `tierComplete.mp3` - Extra celebration
   - `jump.mp3` - Whoosh sound
   - `sticker.mp3` - Pop sound

3. Update the `playSound()` function in `script.js`:
```javascript
function playSound(soundName) {
    const audio = new Audio(`sounds/${soundName}.mp3`);
    audio.play().catch(err => console.log('Audio not ready:', err));
}
```

## Browser DevTools Testing

Open Chrome DevTools (F12) and:
- [ ] Check Console tab for errors
- [ ] Monitor Network tab for failed requests
- [ ] Use mobile emulator to test responsive design
- [ ] Test touch simulation mode

## Recommended Test Devices

- iPhone 12/13 (Safari) - iOS standard
- iPad (Safari) - Larger touch target validation
- Samsung Galaxy (Chrome) - Android standard
- Any older device (iPhone 8, etc.) - Performance baseline

## Post-Testing Optimizations

Based on test results, consider:
- Adjust touch target sizes if too small
- Throttle canvas draw events if performance poor
- Simplify animations if lag detected
- Adjust difficulty curve if too easy/hard
- Add more visual feedback if interactions unclear

## Success Criteria

✅ Game loads instantly (< 1 second)
✅ No console errors
✅ Drag-and-drop works on mobile and desktop
✅ All 4 tiers + endless mode function correctly
✅ All 3 intermission games work
✅ Child can play independently for 5+ minutes
✅ Positive, encouraging experience throughout
