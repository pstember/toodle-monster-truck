# Toddler Jigsaw — Technical Specification

## Project overview

Web **jigsaw** puzzle for toddlers (3+): drag pieces from a **tray** onto a **fixed board**; each piece only **snaps** into its **correct** slot. Wrong drops return to the tray.

**Platform**: Static single-page app (Vite build → one `dist/index.html`).  
**UI language**: French.  
**Piece shapes**: **Voronoi cells** with **BSC-style “tongue” edges** along internal cuts (not a rectangular grid of classic tabs).

## Repository layout

```
toddler-puzzle/
├── index.html              # Styles + shell markup + inline theme bootstrap
├── src/
│   ├── main.js             # UI: theme, Voronoi build, drag/drop, image, audio, tongue sliders
│   ├── puzzle-logic.js     # Pure: board/tray, placePiece, win, background %
│   ├── puzzle-logic.test.js
│   ├── voronoi-jigsaw.js   # Delaunay/Voronoi + clip paths + tongue sampling
│   ├── voronoi-jigsaw.test.js
│   ├── bsc-tongue.js       # Weighted cubic NURBS tongue along an edge
│   ├── bsc-tongue.test.js
│   └── tongue-params.js    # Default + live params for tongue geometry
├── e2e/
│   └── game.spec.js        # Playwright smoke + __PUZZLE_TEST__.solve
├── package.json
├── vite.config.js          # vite-plugin-singlefile on production build only
├── vitest.config.js
├── playwright.config.js    # WebKit project; webServer: npm run dev
├── README.md
└── SPEC.md
```

**Runtime dependency**: [`d3-delaunay`](https://github.com/d3/d3-delaunay) (Delaunay → Voronoi).

## Technical architecture

### DOM essentials

- `#puzzle-grid` — board area; slots are absolutely positioned from Voronoi bounds per piece.
- `#piece-tray` (`data-testid="piece-tray"`) — shuffled pieces.
- `#hint-overlay` — full-image overlay (toggle with **Aide**).
- `#win-overlay` — “Bravo !” after solve.
- `svg#svg-defs` — `<clipPath id="piece-voronoi-{i}">` for each piece `i` (`clipPathUnits="objectBoundingBox"`).
- `#theme-select` — clair / sombre / système (`localStorage` key `puzzle-theme`).
- `#tongue-panel` — collapsible sliders tuning tongue parameters (dev/parent tuning); **Nouvelle graine** changes Voronoi sites while keeping layout seed logic in `main.js`.

### Game state (`puzzle-logic.js`)

Same invariants as before: `board[i] === i` when solved; only `pieceId === slotIndex` allowed for placement; tray holds unplaced ids.

### Piece geometry (`voronoi-jigsaw.js` + `bsc-tongue.js`)

1. **Sites**: pseudo-random points in the unit square (seeded RNG via `createSeededRandom(voronoiLayoutSeed)` in `main.js`).
2. **Delaunay / Voronoi**: `d3-delaunay` builds the diagram; each cell becomes one puzzle piece.
3. **Edges**: Internal Voronoi edges are replaced by interlocking tongue curves (`sampleBscTongueEdge`), using parameters from `tongue-params.js`. Outer boundary edges stay straight (see `isOuterBoundaryEdge`).
4. **Output**: Per piece, normalized SVG path `pathDNormalized` for `clip-path: url(#piece-voronoi-{id})` and tray outlines.

Reference idea: [Mathematica SE — Voronoi jigsaw cuts](https://mathematica.stackexchange.com/questions/6706/how-can-i-calculate-a-jigsaw-puzzle-cut-path).

### Image pipeline

- **Cover** crop in canvas to match grid aspect ratio (`cols`×`rows`).
- **Background position**: `backgroundPercentForPiece(pieceId, cols, rows)` maps fragment to `%` position (see `puzzle-logic.js`).
- Default Unsplash image + upload + gradient fallback (CORS/taint handling in `main.js`).

### Hints

- **Aide**: toggles `#hint-overlay` visibility (opacity over the board).
- **Delayed slot highlight**: `startHintTimer` / `board-slot--hint` after `HINT_DELAY_MS` (5s) exists in code; starting timers for all tray pieces (`updateHintsForTray`) is **not** called from `renderTray` (commented for debugging). Parents rely primarily on the overlay.

### Win flow

- `onWin()`: Web Audio three-tone “tada”, then `#win-overlay` visible.  
- No confetti layer in the current codebase (older docs referred to CSS confetti; removed).

### Test hook

`window.__PUZZLE_TEST__.solve` — places every piece correctly (used by Playwright).  
`cheatSolve` in `main.js` drives the same path.

## Code map

| Module | Role |
|--------|------|
| `puzzle-logic.js` | State, legality, win, `createSeededRandom`, `backgroundPercentForPiece` |
| `voronoi-jigsaw.js` | `buildVoronoiJigsaw(cols, rows, rng, tongueParams)` → `pieceGeometry` |
| `bsc-tongue.js` | NURBS-style tongue polyline along an edge |
| `tongue-params.js` | `DEFAULT_TONGUE_PARAMS`, `getTongueParams`, `setTongueParam`, … |
| `main.js` | Wiring, `generateAllClipPaths`, `renderBoard` / `renderTray`, drag, theme, sliders |

## Build and test

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (ES modules; needs HTTP) |
| `npm test` | Vitest: `src/**/*.test.js` |
| `npm run build` | Single-file `dist/index.html` (gzip ~22 KB order of magnitude) |
| `npm run test:e2e` | Playwright WebKit; starts `npm run dev` unless URL reused |

First-time E2E: `npx playwright install` (or `npx playwright install webkit`).  
If port `5173` is busy, stop the other process or rely on `reuseExistingServer` when not in CI.

## Automated test coverage

- **Vitest**: `puzzle-logic` (placement, win, backgrounds), `voronoi-jigsaw` (determinism / geometry), `bsc-tongue` (sampling).
- **Playwright**: grid + tray visible, hint toggle, `__PUZZLE_TEST__.solve` → win overlay.

## Modification notes

### New difficulty row in `LEVELS` (`main.js`)

Add `{ name, cols, rows }` and a matching `<option>` in `index.html` if the selector is hardcoded there.

### Stronger / weaker tongues

Adjust `DEFAULT_TONGUE_PARAMS` in `tongue-params.js` or use the **Réglages des langues** panel + **Copier JSON**.

### New Voronoi layout only (same cell count)

**Nouvelle graine** (`voronoiLayoutSeed`) or restart; `startNewGame` with `preserveLayoutSeed` where applicable.

## Browser expectations

Recent browsers with **CSS `clip-path: url(#id)`**, **Canvas**, **Pointer events**, **Web Audio**. Touch-friendly layout in `index.html` CSS.

## Known limitations

- No screen-reader-first UX; toddler-focused visuals.
- Unsplash default image may fail CORS in some environments; upload stays reliable.
- Very large images may slow canvas encoding.

## File manifest (source)

`index.html`, `src/main.js`, `src/puzzle-logic.js`, `src/puzzle-logic.test.js`, `src/voronoi-jigsaw.js`, `src/voronoi-jigsaw.test.js`, `src/bsc-tongue.js`, `src/bsc-tongue.test.js`, `src/tongue-params.js`, `e2e/game.spec.js`, `vite.config.js`, `vitest.config.js`, `playwright.config.js`, `package.json`, `README.md`, `SPEC.md`.

---

## Quick start (contributors)

1. `npm install && npm run dev` — open the printed URL.
2. `npm test` and `npm run test:e2e` before shipping.
3. `npm run build` → deploy `dist/index.html`.
4. In the browser: `window.__PUZZLE_TEST__?.solve()` to verify win UI.

**Last reviewed**: 2026-04-04 (aligned with Voronoi implementation and current UI).
