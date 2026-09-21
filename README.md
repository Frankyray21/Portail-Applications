# Le Hub — Portail d’applications

Boutique publique des applications de Frank. Chaque application a sa fiche :
présentation, ce qu’elle contient, captures d’écran, et un bouton pour
l’ouvrir. Le portail ne copie ni les données ni les comptes des applications.

Trois onglets : **Aujourd’hui** (la mise en avant), **Applications** (le
catalogue par collection) et **Rechercher** (filtrage instantané sur le nom,
les thèmes et le contenu des fiches).

## Collections

- **Prévention & découverte** : Prévention des TMS, Bruit, WIKI SST — Mines, Anatomie 3D.
- **Forage & procédures** : RodBot LP, Procédures de forage MRI.

Aucune note, aucune étoile, aucun avis, aucun compteur de téléchargement,
aucun classement : rien de tout cela n’existe, donc rien de tout cela n’est
affiché. Un test du catalogue et le validateur d’export le vérifient à chaque
construction. La mise en avant de l’onglet « Aujourd’hui » se règle dans
`A_LA_UNE` (`lib/catalogue.ts`) ; chaque entrée doit porter une raison
vérifiable dans l’application elle-même.

Les URL publiques des six applications ont été vérifiées le 5 septembre 2026.
Aucun dépôt privé n’est affiché. Pas de mesure d’audience, de compte ou de
stockage partagé ajouté au portail. Chaque application garde son fonctionnement.

## Identité visuelle

Deux couleurs et deux caractères, rien d’autre.

- **Pétrole** (`--petrole`) pour la coquille : bandeau et onglets.
  **Cuivre** (`--cuivre`) pour l’action : bouton « Ouvrir », liens, onglet
  courant, barre sous les titres. Les neutres sont teintés vers le pétrole.
  Les six plaques d’icônes gardent la couleur de leur application, ramenées
  à la même clarté. Les couleurs sont conçues en OKLCH et écrites en
  hexadécimal dans `app/globals.css`, ratios de contraste en commentaire.
- **Hepta Slab 800** grave les titres et le mot « Le Hub » ;
  **Atkinson Hyperlegible Next**, dessinée pour les lecteurs peu à l’aise,
  compose tout le reste. Les deux fichiers woff2 (sous-ensemble latin, 57 Ko
  en tout) sont dans `app/fonts/`, sous licence OFL (`app/fonts/OFL.txt`) ;
  la construction les copie dans `_next/static/media/` avec le chemin de
  base. Sans eux, le site retombe sur la police système et reste lisible.
- **Mode sombre** : `prefers-color-scheme: dark` redéfinit les jetons et la
  barre du navigateur suit (`theme-color`). Pas de bouton de bascule : il
  faudrait du JavaScript et une mémoire.
- Le favicon reprend la marque : quatre plaques, dont une en cuivre.

## Développement

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 8790
npm test
npm run lint
npm run build
```

La page locale se trouve sous `/Portail-Applications/`.

Le projet utilise React, Vinext et le socle de composants du générateur Sites,
adaptés à la destination demandée : **export statique pour GitHub Pages**.
Aucun serveur Cloudflare, projet Sites hébergé ou service d’authentification
n’est nécessaire. Les dépendances du socle sont conservées ; les correctifs de
sécurité ont été appliqués.

Le contrôle de qualité porte sur le code du portail ; les composants fournis
par le générateur et non modifiés ne sont pas réécrits. La génération vérifie
aussi l’export final et ses ressources. Sous Windows, un délai de sortie de
150 ms évite le [problème de fermeture Node/Undici](https://github.com/nodejs/node/issues/56645)
rencontré après le prérendu ; les codes d’erreur restent inchangés.

## Modifier le catalogue

Le contenu est centralisé dans `lib/catalogue.ts` : nom, description, résumé de
fiche, liste « ce que ça contient », nombre de captures, collection, adresse
publique, dépôt et icône. Ajouter une application explicitement après avoir
vérifié son accès public. Ne pas importer automatiquement tous les dépôts du
compte. Les textes sont descriptifs ; ils ne valident pas le contenu médical,
réglementaire ou technique des applications liées.

Le résumé et la liste « ce que ça contient » se relèvent **dans l’application
elle-même**, pas ailleurs. Rien ne doit y être inventé.

### Captures d’écran

Les captures vivent dans `public/captures/<id>-<n>.jpg`, au format téléphone
(390 × 844, densité 1,5, JPEG qualité 82). Elles sont prises en faisant tourner
l’application localement, pas récupérées ailleurs. Le champ `captures` du
catalogue dit combien il y en a ; un test échoue si un fichier manque.

## Publication

Adresse du portail : `https://frankyray21.github.io/Portail-Applications/`.

Le code source est fusionné dans `main`. Après les tests, la vérification du code
et la construction, seul le contenu de `dist/client/Portail-Applications/` est
publié à la racine de la branche `gh-pages`, avec un fichier `.nojekyll` pour
préserver les ressources `_next`. Dans les réglages Pages, sélectionner
**Deploy from a branch**, branche **gh-pages**, dossier **/ (root)**.

La publication est explicite : une fusion dans `main` ne reconstruit pas le site
automatiquement. Aucun workflow personnalisé ni droit OAuth `workflow` n’est
nécessaire. Si le nom du dépôt change, modifier `basePath` dans `next.config.ts`,
le lien GitHub du pied de page et l’adresse du favicon.

## Version 1.4.0

- Le Hub s’installe : manifeste, icônes 192/512 et maskable, service worker.
- Bouton « Installer Le Hub » quand le navigateur l’offre ; sur iPhone, le
  geste est expliqué (Partager, puis Sur l’écran d’accueil). Rien ne
  s’affiche si l’application est déjà installée, ni sans JavaScript.
- Hors ligne : 32 fichiers préchargés à l’installation (0,97 Mo, captures
  exclues). Les pages passent par le réseau d’abord, le cache ensuite ; les
  actifs versionnés par le cache d’abord.
- `scripts/build-sw.mjs` écrit le service worker après la construction, pour
  qu’il connaisse le nom réel des actifs. Le validateur vérifie le manifeste,
  les icônes, la présence d’un gestionnaire `fetch` et chaque fichier
  préchargé.

## Version 1.3.0

- Identité visuelle : pétrole pour la coquille, cuivre pour l’action,
  Hepta Slab pour les titres et Atkinson Hyperlegible Next pour le texte,
  auto-hébergées. Mode sombre réel, suivant le réglage de l’appareil.
- Bandeau et onglets à la place du rail latéral ; pied de page partout.
- Camping en tente et GlucideNet retirés : six applications, deux collections.
- Nouvelle section « Le fond documentaire » : les sept disciplines du
  WIKI SST — Mines, avec leurs nombres d’articles et un lien direct vers
  chacune. La même liste ouvre la fiche du wiki.
- Le validateur d’export exige les sept sujets, et vérifie qu’une fiche ne
  mène jamais hors de son application.

## Version 1.2.0

- Format boutique : onglets Aujourd’hui, Applications et Rechercher.
- Une fiche par application, avec présentation, contenu réel et captures.
- Quinze captures d’écran réelles, prises en faisant tourner les six
  applications localement.
- Recherche instantanée, insensible aux accents ; la liste complète reste
  rendue par l’export, donc consultable sans JavaScript.
- Feuille de style réécrite en une seule couche, sans surcharges empilées.
- Le validateur d’export exige le chemin de base sur toute URL absolue, une
  seule application ouverte par fiche, et aucune popularité fabriquée.
