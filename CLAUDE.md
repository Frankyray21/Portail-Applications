# Portail SST — MRI : consignes pour Claude

Boutique publique statique (React + vinext), export vers GitHub Pages depuis la
branche `gh-pages`. Adresse du site :
<https://frankyray21.github.io/Portail-Applications/>

## Règles permanentes

À **chaque lot de changements** livré, dans cet ordre :

1. **Monter la version** dans `package.json`, dans le pied de `app/store-shell.tsx`
   (« Portail SST X.Y ») et dans la section de version du `README.md`. Un seul bump
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

## L'identité visuelle appartient à MRI

Les couleurs sont celles de **Machines Roger International**, relevées sur le
logo : rouge `#d22325` sur noir. Ne pas en inventer d'autres.

- `--noir` porte la coquille, `--rouge` porte l'action. Les neutres restent
  gris : aucune autre teinte n'entre dans la palette.
- Le rouge du logo est trop clair pour écrire sur fond pâle. Écrire avec
  `#b81b1d` sur clair, `#ef5a5c` sur noir ; le rouge exact reste celui des
  aplats. Toute valeur ajoutée porte son ratio de contraste en commentaire.
- **Le logo est `assets/logo-portail.png`**, et il n'est pas servi : tout ce
  qui doit l'être en sort par `node scripts/build-icones.mjs` — favicon,
  marque du bandeau, icônes du manifeste, lanceur Android, écran de
  lancement. Ne jamais retoucher un PNG d'icône à la main, les familles
  divergeraient. Aux petites tailles (marque, favicon) le script ne garde
  que la grappe de quatre tuiles : le mot-symbole y serait une tache.
- Les icônes sont quantifiées en palette : sans ça la seule icône de 512 px
  pèse 295 Ko, et tout est préchargé pour l'usage hors ligne.
- **Le sombre est le thème par défaut**, quel que soit le réglage de
  l'appareil. Le clair est un choix explicite (bouton du bandeau, gardé dans
  `localStorage`, rétabli avant le premier affichage par le script de
  `layout.tsx`). Ne pas remettre de bascule sur `prefers-color-scheme`.

## Chaque application, une seule fois

L'accueil présente les cinq applications **une fois**, dans « Les cinq
applications ». Pas de bande « à la une » qui en répéterait trois au-dessus :
sur une tablette de terrain, ce doublon rallongeait la page sans rien
apprendre. Une mise en avant éditoriale, si elle revient un jour, doit
remplacer une présentation, pas s'y ajouter.

## Ouvrir, installer : ce que le portail peut dire

Le portail voudrait faire comme une boutique : « Installer » quand ce n'est
pas installé, « Ouvrir » quand ça l'est. **Il ne peut pas.**

- Un site **ne peut ni installer ni détecter** la PWA d'un autre site.
  `beforeinstallprompt` ne concerne que sa propre origine, `navigator.install`
  n'existe pas encore (absent de Chrome 141), et
  `navigator.getInstalledRelatedApps()` ne voit que la PWA du site qui
  l'appelle. Aucun contournement : c'est une protection contre le pistage.
- Le bouton dit donc **« Ouvrir »**, seul libellé vrai dans les deux cas :
  installée, l'application s'ouvre telle quelle ; sinon, elle s'ouvre dans le
  navigateur. Ne pas le remplacer par « Installer », ce serait promettre un
  geste que le portail ne fait pas.
- Le geste d'installation est expliqué là où il y a la place : le chapeau de
  l'accueil et le bloc « L'avoir sous terre » de chaque fiche, geste iPhone
  compris. Ne pas retirer ces passages.
- Le champ `installable` du catalogue est **relevé**, jamais supposé :
  manifeste lié, `display: standalone`, icônes 192/512/masquable et service
  worker, sur la branche publiée de l'application. Il commande le bloc
  d'installation de la fiche.

## Tablette de terrain

La cible est une **Galaxy Tab Active4 Pro** : 1920 × 1200 à densité 1,5, soit
1280 × 800 px CSS en paysage et 800 × 1280 en portrait, manipulée avec des
gants.

- En paysage l'écran n'a que 800 px de haut : un palier
  `(min-width: 901px) and (max-height: 860px)` resserre le titre et son
  chapeau pour que les applications restent au-dessus de la ligne de
  flottaison.
- `@media (pointer: coarse)` porte les commandes principales à 48 px.
- Vérifier à onze largeurs, de 320 à 1920 px, avec les deux types de
  pointeur : aucun débordement, et l'invite du champ de recherche entière.

## Application Android (APK)

Le portail existe aussi en APK, compilé par `.github/workflows/build-apk.yml` à
chaque poussée sur `main`. Capacitor enveloppe l'export, rebâti avec
`PORTAIL_BASE` vide (`scripts/build-apk-www.mjs`) parce que le préfixe
`/Portail-Applications` n'existe pas dans une WebView.

- **La clé de signature ne va jamais dans le dépôt.** Elle vit dans quatre
  secrets GitHub (voir README, « Application Android »). Un APK signé d'une
  autre clé ne peut pas remplacer l'installation existante.
- Le bouton de téléchargement du site n'apparaît que si la release existe :
  lancer `node scripts/relever-apk.mjs` avant de déployer, jamais éditer
  `lib/telechargement.ts` à la main.
- Les icônes du site ET celles d'Android viennent du même script,
  `scripts/build-icones.mjs` ; le motif de l'icône adaptative doit
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
