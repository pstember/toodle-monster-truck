# Implementation Plan: Toddler Monster Truck Match Game

**Date Created:** 2026-04-01
**Estimated Completion:** 17 hours
**Overall Complexity:** MEDIUM-HIGH

---

## Project Overview

Building a toddler-friendly browser game with progressive difficulty and positive reinforcement.

**Core Features:**
- Drag-and-drop matching game with monster trucks and shapes/tires
- Progressive difficulty with **growing shape/color pool** across **4 tiers**
- Infinite procedural level generation after level 12
- 3 intermission mini-games every 3 levels (Mud Wash, Sticker Shop, Big Jump)
- Zero-dependency vanilla JS/HTML/CSS (no external images)
- Mobile-first touch support with massive touch targets
- Positive-only feedback (no fail states, timers, or scores)

**Tech Constraints:**
- Pure vanilla JS/HTML/CSS
- CSS shapes/emojis only (no images)
- Touch + mouse dual-input support
- Landscape phone orientation optimized

---

## Progressive Difficulty System

### Tier 1: Foundation (Levels 1-3)
- **Unlocked shapes:** Circle, Square only
- **Unlocked colors:** Red only
- **Challenge:** 1 target slot, 3 inventory items
- **Goal:** Learn drag-and-drop, basic shape recognition

### Tier 2: Color Introduction (Levels 4-6)
- **Unlocked shapes:** Circle, Square, Triangle (NEW)
- **Unlocked colors:** Red, Blue (NEW)
- **Challenge:** 2 target slots, 4 inventory items
- **Goal:** Differentiate shapes AND colors simultaneously

### Tier 3: Palette Expansion (Levels 7-9)
- **Unlocked shapes:** Circle, Square, Triangle, Star (NEW), Heart (NEW)
- **Unlocked colors:** Red, Blue, Green (NEW), Yellow (NEW)
- **Challenge:** 2-3 target slots, 5 inventory items
- **Goal:** Handle more complex combinations

### Tier 4: Size Sorting (Levels 10-12)
- **Unlocked shapes:** Previous + Pentagon (NEW), Hexagon (NEW)
- **Unlocked colors:** Previous + Purple (NEW), Orange (NEW)
- **Challenge:** Papa Truck (large) or Baby Truck (small), 3 targets, 6 inventory
- **Goal:** Introduce size concept with richer variety

### Level 13+ (Endless Mode)
- **Unlocked shapes:** ALL 8 shapes (Circle, Square, Triangle, Star, Heart, Pentagon, Hexagon, Diamond)
- **Unlocked colors:** ALL 8 colors (Red, Blue, Green, Yellow, Purple, Orange, Pink, Cyan)
- **Challenge:** 2-4 target slots, 4-8 inventory items
- **Goal:** Infinite replayability without repetition

---

## Progression Summary Table

| Tier | Levels | Shapes | Colors | Targets | Inventory | Concept |
|------|--------|--------|--------|---------|-----------|---------|
| 1 | 1-3 | 2 | 1 | 1 | 3 | Basic shapes only |
| 2 | 4-6 | 3 | 2 | 2 | 4 | Add color matching |
| 3 | 7-9 | 5 | 4 | 2-3 | 5 | Rich palette |
| 4 | 10-12 | 7 | 6 | 3 | 6 | Size sorting |
| Endless | 13+ | 8 | 8 | 2-4 | 4-8 | Full variety |

**Intermissions:** Every 3 levels (after levels 3, 6, 9, 12, 15...)

---

## Implementation Phases

### Phase 1: Project Structure & Base HTML/CSS (1.5 hours)
**Files:**
- `index.html` - Game structure
- `style.css` - Layout, shapes, colors
- `script.js` - Entry point

**Deliverables:**
- Mobile viewport setup
- 8 CSS shape classes (circle, square, triangle, star, heart, pentagon, hexagon, diamond)
- 8 CSS color variables (red, blue, green, yellow, purple, orange, pink, cyan)
- Size modifiers (large, small)
- Flexbox layout (truck 60%, inventory 40%)
- CSS truck representation

### Phase 2: Core Drag-and-Drop System (3 hours)
**Components:**
- Dual input handlers (mouse + touch)
- `handleDragStart`, `handleDragMove`, `handleDragEnd`
- Touch event normalization
- Collision detection (`checkOverlap`)
- Snap-to-slot animation
- Bounce-back animation for mismatches

### Phase 3: Progressive Level Generation (3.5 hours)
**Key Functions:**
- `generateLevel(levelCount)` - Main generator
- `getUnlockedShapes(levelCount)` - Returns available shapes for tier
- `getUnlockedColors(levelCount)` - Returns available colors for tier
- Slot rendering with `data-required-*` attributes
- Random selection logic for endless mode

**Data Structures:**
```javascript
const ALL_SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'pentagon', 'hexagon', 'diamond'];
const ALL_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
const SIZES = ['large', 'small'];
```

### Phase 4: Match Validation & Feedback (2 hours)
**Functions:**
- `validateMatch(item, slot)` - Compare attributes
- Success path: snap animation, sound, check completion
- Failure path: bounce animation, gentle sound
- Level complete sequence: truck drives off, confetti, next level
- Tier celebration (every 3 levels): extra confetti + overlay

### Phase 5: Intermission Mini-Games (4 hours)

**Game A - Mud Wash:**
- Canvas overlay with brown fill
- Eraser on drag/swipe
- 80% clear threshold
- Truck reveal animation

**Game B - Sticker Shop:**
- Blank truck
- 5 draggable emoji stickers (⭐🔥💀🎉🌈)
- Free-form placement
- Giant "DONE!" button

**Game C - Big Jump:**
- Auto-drive to ramp animation
- Giant "JUMP!" button (bottom half)
- Backflip animation + fireworks
- Auto-advance

### Phase 6: Audio System & Polish (2 hours)
**Audio Placeholders:**
```javascript
function playSound(soundName) {
  // Future: new Audio(`sounds/${soundName}.mp3`).play()
}
```

**Sounds:**
- `success.mp3` - Match success
- `tryAgain.mp3` - Gentle bounce
- `levelComplete.mp3` - Truck vroom + confetti
- `tierComplete.mp3` - Extra celebration
- `jump.mp3` - Backflip
- `sticker.mp3` - Sticker placed

**CSS Polish:**
- Pulsing glow on empty slots
- Spring bounce on snap
- Confetti particle system
- Shape unlock animations

### Phase 7: Mobile Optimization & Testing (1 hour)
- Chrome DevTools mobile emulator testing
- Touch targets ≥80px
- `touch-action: none` on game area
- Orientation prompt (landscape)
- Cross-browser testing (Chrome, Safari, Firefox)
- Performance optimization (requestAnimationFrame)

---

## File Structure
```
toddler-truck-game/
├── PLAN.md             (this file)
├── index.html          (~150 lines)
├── style.css           (~500 lines)
└── script.js           (~750 lines)
```

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Touch events don't fire on some devices | MEDIUM | Implement both touch and pointer events |
| Canvas eraser performance on older phones | MEDIUM | Smaller canvas resolution, throttle events |
| Drag conflicts with browser scroll | HIGH | `preventDefault()` on touchmove, `touch-action: none` |
| Complex shapes hard to distinguish | MEDIUM | Distinct colors + larger sizes early on |
| Child accidentally closes browser | LOW | Optional `beforeunload` warning |

---

## Key Design Decisions

1. **Progressive Unlocking:** Shapes and colors unlock gradually to prevent overwhelming the child
2. **No Fail States:** Wrong matches bounce back gently, no negative feedback
3. **Massive Touch Targets:** All interactive elements ≥80px
4. **Pure CSS Visuals:** No image dependencies, instant loading
5. **Intermissions Every 3 Levels:** Breaks up matching with sensory mini-games
6. **Endless Mode After Level 12:** Infinite replayability with full palette

---

## Success Criteria

- [x] Plan approved and documented
- [ ] All 3 core files created (HTML, CSS, JS)
- [ ] Drag-and-drop works on mobile and desktop
- [ ] Progressive unlocking functions correctly
- [ ] All 4 tiers + endless mode implemented
- [ ] All 3 intermission mini-games working
- [ ] Audio placeholder system ready
- [ ] Tested on mobile device (landscape mode)
- [ ] No console errors, smooth performance

---

## Next Steps

1. Create `index.html` with semantic structure
2. Build `style.css` with shapes, colors, layout
3. Implement `script.js` with core game loop
4. Test drag-and-drop on mobile emulator
5. Implement level generation logic
6. Add intermission mini-games
7. Polish animations and audio placeholders
8. Final mobile testing
