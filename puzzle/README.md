# Puzzle pour Enfants

Un **puzzle jigsaw** web (pièces à emboîtements), glissable-déposable, pensé pour les **3 ans et +**.

![Puzzle Game](https://img.shields.io/badge/Age-3%2B-brightgreen) ![Vite](https://img.shields.io/badge/Build-Vite-646cff) ![Tests](https://img.shields.io/badge/Tests-Vitest%20%2B%20Playwright-green)

## Caractéristiques

### Mécaniques de jeu

- **Formes de puzzle** : découpe **Voronoi** + bords en « langues » (courbes qui s’emboîtent), rendues en SVG **`clip-path`**
- **Plateau + bac à pièces** : faites glisser chaque pièce vers **son emplacement** (une seule case correcte par pièce)
- **Retour doux** si la pièce est lâchée au mauvais endroit
- **Son bref** à chaque bon placement ; **fanfare** (Web Audio) à la victoire ; overlay **Bravo !**
- **5 niveaux** : 3×3 à 8×6

### Personnalisation

- Photo par défaut (chat, Unsplash) avec `crossOrigin` pour le recadrage canvas
- Upload de photo (JPEG, PNG, etc.)
- Recadrage type *cover* pour respecter le ratio de la grille
- **Thème** : clair, sombre ou **système** (stocké dans `localStorage`)

### Réglages avancés (forme des pièces)

- Panneau **Réglages des langues** : curseurs pour la géométrie des languettes, réinitialisation, **nouvelle graine** Voronoi, copie JSON des paramètres (voir `src/tongue-params.js`).

### Interface enfant

- Boutons **≥ 48px**, libellés en **français**
- **Aide** : image cible en transparence sur le plateau
- **Numéros** (optionnel) : repère sur chaque pièce

## Développement

```bash
cd toddler-puzzle
npm install
npm run dev          # http://127.0.0.1:5173 — édition avec `src/` en modules ES
```

### Tests

```bash
npm test             # Vitest — logique pure (placement, victoire)
npm run test:e2e     # Playwright — fumée + hook de victoire (démarre Vite automatiquement)
```

Après `npm install`, si les navigateurs Playwright manquent : `npx playwright install` ou `npx playwright install webkit` (le projet cible **WebKit** dans `playwright.config.js`). Si le port `5173` est déjà pris par un autre `npm run dev`, arrêtez-le ou laissez Playwright réutiliser le serveur (hors `CI`).

Sur **GitHub**, le workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) lance `npm test`, `npm run build` et `npm run test:e2e` sur les pushes et pull requests vers `main` ou `master`.

### Build de production (une seule page HTML)

Il n’y a **aucun serveur d’application** à l’exécution : tout est statique. En développement, Vite sert les fichiers ; pour la prod, le build produit **un seul fichier** prêt à héberger.

```bash
npm run build        # génère dist/index.html (JS inlined, ~21 ko)
npm run preview      # test local du fichier de prod
```

[`vite-plugin-singlefile`](https://github.com/richardtallent/vite-plugin-singlefile) regroupe le JS (et le CSS s’il y en a) **dans** `index.html`. Le dossier `dist/` ne contient en pratique **que** `index.html` (ordre de grandeur **~22 ko** gzip selon les builds).

### GitHub Pages

1. Lancer `npm run build`.
2. Déployer **`dist/index.html`** comme page d’accueil du site (par ex. branche `gh-pages`, dossier `/docs`, ou artefact CI).

Pas besoin de Node, PHP ou autre côté serveur sur GitHub : c’est du HTML statique.  
**Note :** l’image Unsplash par défaut peut être soumise aux règles CORS selon l’URL ; l’upload d’une photo locale ou une image en `data:` reste fiable partout. Ouvrir le fichier en `file://` fonctionne pour le jeu ; l’image distante peut exiger `http(s)://`.

## Comment jouer

| Contrôle | Action |
|----------|--------|
| Choisir une photo | Import d’image |
| Menu difficulté | Taille de la grille |
| Aide | Affiche l’image complète en surimpression |
| Numéros | Affiche un numéro sur chaque fragment |

1. Les pièces mélangées sont dans le **bac** sous le plateau.
2. **Glissez** une pièce vers la case qui correspond à l’image ; si c’est la bonne, elle **s’accroche**.
3. Sinon, la pièce **revient** dans le bac.
4. Quand tout est en place : **Bravo !** et message de victoire.

## Compatibilité

Navigateurs récents avec **CSS Grid**, **SVG clip-path**, **Canvas** (recadrage), **Web Audio** (sons). Tablette recommandée.

## Documentation

- **[SPEC.md](SPEC.md)** — architecture (Voronoi, état du jeu, build, tests)
- **Règles de placement** : [`src/puzzle-logic.js`](src/puzzle-logic.js)
- **UI & interaction** : [`src/main.js`](src/main.js)
- **Géométrie des pièces** : [`src/voronoi-jigsaw.js`](src/voronoi-jigsaw.js), [`src/bsc-tongue.js`](src/bsc-tongue.js), [`src/tongue-params.js`](src/tongue-params.js)

## Licence

Usage personnel et éducatif.

---

**Astuce parents** : commencez en **Débutant (3×3)** ; montez la difficulté quand l’enfant est à l’aise.
