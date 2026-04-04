# Toddler games

Two small browser games for young children, served from one repo.

- **Hub (local):** from this directory run `npx serve .` and open the URL shown (port 3000 or 8080).
- **GitHub Pages:** [https://pstember.github.io/toodler-games/](https://pstember.github.io/toodler-games/)

| Folder | Contents |
|--------|----------|
| [truck/](truck/) | Monster Truck Match — vanilla HTML/CSS/JS |
| [puzzle/](puzzle/) | Vite + single-file build for the jigsaw puzzle |

Deployment builds the puzzle with `VITE_BASE=/toodler-games/puzzle/` (repo name comes from the workflow) and copies `truck/` and the hub `index.html` into the published site.

### GitHub Pages (required for the puzzle)

The published site **must** come from the **Deploy GitHub Pages** workflow (Actions artifact), not from **Deploy from a branch**.

If Pages is set to deploy the `main` branch at the repository root, GitHub serves the raw [`puzzle/index.html`](puzzle/index.html) from git. That file is the Vite **development** entry and used to request `/src/main.js`, which resolves to `https://pstember.github.io/src/main.js` and returns 404. The production puzzle is the **built** output in `puzzle/dist/`, which the workflow copies into the published site.

1. Repo **Settings → Pages → Build and deployment**
2. Set **Source** to **GitHub Actions** (not “Deploy from a branch”)
3. Push to `main` so the workflow runs; wait for it to finish

The `Unchecked runtime.lastError` message in the console is usually from a browser extension and can be ignored.
