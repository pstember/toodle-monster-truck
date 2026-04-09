# Toddler Games

A collection of browser games for young children (ages 3+), served from a unified hub.

- **Hub (local):** from this directory run `npx serve .` and open the URL shown (port 3000 or 8080).
- **GitHub Pages:** [https://pstember.github.io/toodler-games/](https://pstember.github.io/toodler-games/)

## Project Structure

| Folder | Contents |
|--------|----------|
| **/** | Hub page with game selection, theme/language controls |
| [truck/](truck/) | Monster Truck Match — vanilla HTML/CSS/JS drag-and-drop game |
| [puzzle/](puzzle/) | Photo Puzzle — Vite + single-file build, Voronoi jigsaw |
| [rhythm/](rhythm/) | Tap the Colors — levels 1–3, optional Challenger (4 lanes + tighter window), timing band (vanilla ES modules) |
| [shared/](shared/) | Shared theme and i18n utilities used by the hub and all games |

### Shared Infrastructure

All games (Hub, Truck, Puzzle, Rhythm) share:
- **Theme synchronization** - Light/dark/system preference syncs across games
- **Language synchronization** - English/French/Spanish preference syncs across games
- **Consistent colors** - Canonical theme colors (`#1e3a5f` light, `#0f172a` dark)

See [shared/README.md](shared/README.md) for details on the shared utilities.

Deployment builds the puzzle with `VITE_BASE=/toodler-games/puzzle/` (repo name comes from the workflow) and copies `truck/`, `rhythm/`, and the hub `index.html` into the published site.

### GitHub Pages (required for the puzzle)

The published site **must** come from the **Deploy GitHub Pages** workflow (Actions artifact), not from **Deploy from a branch**.

If Pages is set to deploy the `main` branch at the repository root, GitHub serves the raw [`puzzle/index.html`](puzzle/index.html) from git. That file is the Vite **development** entry and used to request `/src/main.js`, which resolves to `https://pstember.github.io/src/main.js` and returns 404. The production puzzle is the **built** output in `puzzle/dist/`, which the workflow copies into the published site.

1. Repo **Settings → Pages → Build and deployment**
2. Set **Source** to **GitHub Actions** (not “Deploy from a branch”)
3. Push to `main` so the workflow runs; wait for it to finish

The `Unchecked runtime.lastError` message in the console is usually from a browser extension and can be ignored.

### npm / corporate proxy vs GitHub Actions

Your machine may use a private npm proxy (Artifactory, etc.). This repo pins the **public** registry in [`puzzle/.npmrc`](puzzle/.npmrc) and [`truck/.npmrc`](truck/.npmrc) so `npm ci` in CI and `package-lock.json` URLs stay consistent with **registry.npmjs.org**. In `puzzle/` and `truck/`, that project file overrides your user-level proxy for this project only.

Workflows also set `NPM_CONFIG_REGISTRY` so the runner never picks up a stray token.

### Easiest ways to play (no npm headaches)

| Goal | What to do |
|------|------------|
| **Just play everything** | Use the hosted site: [GitHub Pages](https://pstember.github.io/toodler-games/) (after Actions deploy). |
| **Truck only, locally** | No install: `npx serve .` from the repo root (or `npx serve truck` from anywhere) and open the URL. The truck game is plain static files. |
| **Puzzle only, locally** | Either use the hosted Pages URL, or run `npm ci && npm run dev` inside `puzzle/` (uses [`puzzle/.npmrc`](puzzle/.npmrc)), or `npm run build` then `npx serve puzzle/dist`. |
| **Rhythm only, locally** | No install: `npx serve .` from the repo root and open `/rhythm/` (static ES modules, like Truck). |
| **Run Playwright tests** | Needs `npm ci` in `truck/` (or `puzzle/` for e2e) with the lockfiles as committed. |
