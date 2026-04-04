# Toddler games

Two small browser games for young children, served from one repo.

- **Hub (local):** from this directory run `npx serve .` and open the URL shown (port 3000 or 8080).
- **GitHub Pages:** [https://pstember.github.io/toodler-games/](https://pstember.github.io/toodler-games/)

| Folder | Contents |
|--------|----------|
| [truck/](truck/) | Monster Truck Match — vanilla HTML/CSS/JS |
| [puzzle/](puzzle/) | Vite + single-file build for the jigsaw puzzle |

Deployment builds the puzzle with `VITE_BASE=/toodler-games/puzzle/` (repo name comes from the workflow) and copies `truck/` and the hub `index.html` into the published site.

Enable **GitHub Pages** with source **GitHub Actions** in the repository settings so the deploy workflow can publish.
