# 🚙 Toddler Monster Truck Match

A colorful, forgiving drag-and-drop matching game designed specifically for 3-year-olds.

## Features

- **Progressive Difficulty:** Shapes and colors unlock gradually across 4 tiers
- **Positive Reinforcement:** No timers, no fail states, only celebrations
- **Touch-Friendly:** Massive touch targets optimized for tiny fingers
- **Intermission Mini-Games:** Fun breaks every 3 levels (Mud Wash, Sticker Shop, Big Jump)
- **Zero Dependencies:** Pure HTML/CSS/JavaScript, no external images needed

## Quick Start

Simply open `index.html` in any modern browser. Works best on mobile devices in landscape mode.

## Tech Stack

- Vanilla JavaScript
- CSS Flexbox/Grid
- HTML5 Canvas (for mini-games)
- CSS Shapes (no image dependencies)

## Game Structure

- **Levels 1-3:** Basic shape matching (Circle, Square)
- **Levels 4-6:** Shape + color matching (adds Triangle, Blue)
- **Levels 7-9:** Expanded palette (adds Star, Heart, Green, Yellow)
- **Levels 10-12:** Size sorting (adds Pentagon, Hexagon, Purple, Orange)
- **Level 13+:** Endless mode with full palette (8 shapes, 8 colors)

## Development

See `PLAN.md` for detailed implementation plan and architecture decisions.

## Adding Sounds

Replace the placeholder `playSound()` function in `script.js` with:

```javascript
function playSound(soundName) {
  new Audio(`sounds/${soundName}.mp3`).play();
}
```

Then add your `.mp3` files to a `sounds/` directory:
- `success.mp3`
- `tryAgain.mp3`
- `levelComplete.mp3`
- `tierComplete.mp3`
- `jump.mp3`
- `sticker.mp3`
