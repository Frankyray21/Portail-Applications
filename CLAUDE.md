# Le Hub — portail d'applications : consignes pour Claude

Boutique publique statique (React + vinext), export vers GitHub Pages depuis la
branche `gh-pages`. Adresse du site :
<https://frankyray21.github.io/Portail-Applications/>

## Règles permanentes

À **chaque lot de changements** livré, dans cet ordre :

1. **Monter la version** dans `package.json`, dans le pied de `app/store-shell.tsx`
   (« Le Hub X.Y ») et dans la section de version du `README.md`. Un seul bump
   par lot, pas un par commit. Pas de bump si aucun fichier servi ne change.
2. **Déployer** : `npm run build` (qui écrit aussi `sw.js` via
   `scripts/build-sw.mjs`), puis publier le contenu de
   `dist/client/Portail-Applications/` à la racine de `gh-pages`, avec
   `.nojekyll` (sans lui, GitHub Pages ignore les ressources `_next`).
3. **Pousser sur `main`** : la branche de travail est fusionnée dans `main`,
   qui ne doit jamais diverger de ce qui est publié.
4. **Partager le lien du site déployé** dans la réponse, à chaque fois.

Répondre à l'utilisateur en français.

## Avant de déployer, tout doit passer

```sh
npx --no-install tsc --noEmit
npx --no-install oxlint app lib tests next.config.ts vite.config.ts
npm test
npm run build            # lance aussi scripts/validate-export.mjs
```

## Ce qui ne se négocie pas

- **Aucune popularité fabriquée** : ni note, ni étoile, ni avis, ni compteur de
  téléchargement, ni classement. Un test du catalogue et le validateur d'export
  le vérifient ; ne pas les contourner.
- **Rien d'inventé sur une fiche.** Résumés et listes « ce que ça contient » se
  relèvent dans l'application elle-même. Les captures sont de vraies captures,
  prises en faisant tourner l'application.
- **Le site doit fonctionner sans JavaScript** : les applications restent
  atteignables, la recherche affiche quand même la liste complète.
- **Contraste WCAG AA partout**, cibles interactives ≥ 44 px, aucun débordement
  horizontal de 320 à 1920 px, `prefers-reduced-motion` respecté.

## Application Android (APK)

Le Hub existe aussi en APK, compilé par `.github/workflows/build-apk.yml` à
chaque poussée sur `main`. Capacitor enveloppe l'export, rebâti avec
`PORTAIL_BASE` vide (`scripts/build-apk-www.mjs`) parce que le préfixe
`/Portail-Applications` n'existe pas dans une WebView.

- **La clé de signature ne va jamais dans le dépôt.** Elle vit dans quatre
  secrets GitHub (voir README, « Application Android »). Un APK signé d'une
  autre clé ne peut pas remplacer l'installation existante.
- Le bouton de téléchargement du site n'apparaît que si la release existe :
  lancer `node scripts/relever-apk.mjs` avant de déployer, jamais éditer
  `lib/telechargement.ts` à la main.
- Les icônes et l'écran de lancement viennent de
  `scripts/build-icones-android.mjs` ; le motif de l'icône adaptative doit
  tenir dans la zone sûre du lanceur (au plus 0,47 de la toile).

## Pièges connus

- `next/image` **n'applique pas** le `basePath` dans ce moteur : les images
  sortent en 404. Passer par `ressource()` de `lib/base.ts`, seule source du
  chemin public, que `next.config.ts` lit aussi.
- Le validateur exige le chemin de base sur **toute** URL absolue du rendu.
- Une fiche peut pointer profond dans SON application (les sujets du wiki),
  jamais vers une autre.
- Les nombres d'articles des sujets du wiki sont relevés sur le portail du
  wiki lui-même ; les rafraîchir en les y relisant, jamais en les estimant.
