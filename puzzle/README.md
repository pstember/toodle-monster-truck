# Puzzle pour Enfants

**Puzzle jigsaw** web. Pièces emboîtements. Glisse-dépose. Pour **3 ans et +**.

![Puzzle Game](https://img.shields.io/badge/Age-3%2B-brightgreen) ![Vite](https://img.shields.io/badge/Build-Vite-646cff) ![Tests](https://img.shields.io/badge/Tests-Vitest%20%2B%20Playwright-green)

## Caractéristiques

### Mécaniques de jeu

- **Formes puzzle** : découpe **Voronoi** + bords « langues » (courbes emboîtent), render SVG **`clip-path`**
- **Plateau + bac pièces** : glisse pièce vers **emplacement correct** (une case par pièce)
- **Retour doux** si lâché mauvais endroit
- **Son bref** bon placement ; **fanfare** (Web Audio) victoire ; overlay **Bravo !**
- **5 niveaux** : 3×3 à 8×6

### Personnalisation

- Photo défaut (chat, Unsplash) avec `crossOrigin` pour recadrage canvas
- Upload photo (JPEG, PNG, etc.)
- Recadrage type *cover* respecte ratio grille
- **Thème** : clair, sombre ou **système** (stocké `localStorage`)
- **Sync** : préférences thème et langue partagées avec hub et jeu camion via `../shared/theme.js` et `../shared/i18n.js`

### Réglages avancés (forme des pièces)

- Panneau **Réglages langues** : curseurs géométrie languettes, reset, **nouvelle graine** Voronoi, copie JSON paramètres (voir `src/tongue-params.js`).

### Interface enfant

- Boutons **≥ 48px**, libellés **français**
- **Aide** : image cible transparence sur plateau
- **Numéros** (optionnel) : repère chaque pièce

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

Après `npm install`, si navigateurs Playwright manquent : `npx playwright install` ou `npx playwright install webkit` (projet cible **WebKit** dans `playwright.config.js`). Si port `5173` déjà pris par autre `npm run dev`, arrête ou laisse Playwright réutiliser serveur (hors `CI`).

Sur **GitHub**, workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) lance `npm test`, `npm run build` et `npm run test:e2e` sur push et PR vers `main` ou `master`.

### Build de production (une seule page HTML)

**Aucun serveur app** à l'exécution : tout statique. En dev, Vite sert fichiers ; prod, build produit **un fichier** prêt héberger.

```bash
npm run build        # génère dist/index.html (JS inlined, ~21 ko)
npm run preview      # test local du fichier de prod
```

[`vite-plugin-singlefile`](https://github.com/richardtallent/vite-plugin-singlefile) regroupe JS (et CSS si existe) **dans** `index.html`. Dossier `dist/` contient **que** `index.html` (ordre **~22 ko** gzip selon build).

### GitHub Pages

1. Lance `npm run build`.
2. Déploie **`dist/index.html`** comme page accueil site (ex. branche `gh-pages`, dossier `/docs`, ou artefact CI).

Pas besoin Node, PHP ou autre côté serveur sur GitHub : HTML statique.  
**Note :** image Unsplash défaut peut avoir règles CORS selon URL ; upload photo locale ou image `data:` reste fiable partout. Ouvrir fichier en `file://` fonctionne pour jeu ; image distante peut exiger `http(s)://`.

## Comment jouer

| Contrôle | Action |
|----------|--------|
| Choisir photo | Import image |
| Menu difficulté | Taille grille |
| Aide | Affiche image complète surimpression |
| Numéros | Affiche numéro chaque fragment |

1. Pièces mélangées dans **bac** sous plateau.
2. **Glisse** pièce vers case correspond image ; si bonne, **s'accroche**.
3. Sinon, pièce **revient** dans bac.
4. Quand tout en place : **Bravo !** et message victoire.

## Compatibilité

Navigateurs récents avec **CSS Grid**, **SVG clip-path**, **Canvas** (recadrage), **Web Audio** (sons). Tablette recommandée.

## Documentation

- **[SPEC.md](SPEC.md)** — architecture (Voronoi, état jeu, build, tests)
- **Règles placement** : [`src/puzzle-logic.js`](src/puzzle-logic.js)
- **UI & interaction** : [`src/main.js`](src/main.js)
- **Géométrie pièces** : [`src/voronoi-jigsaw.js`](src/voronoi-jigsaw.js), [`src/bsc-tongue.js`](src/bsc-tongue.js), [`src/tongue-params.js`](src/tongue-params.js)

## Licence

Usage personnel et éducatif.

---

**Astuce parents** : commence **Débutant (3×3)** ; monte difficulté quand enfant à l'aise.