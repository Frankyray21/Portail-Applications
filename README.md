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

## Application Android

Le Hub existe aussi en APK : le site entier, embarqué, qui s'ouvre sans
réseau dès l'installation. Le fichier est toujours à la même adresse :

<https://github.com/Frankyray21/Portail-Applications/releases/download/apk-latest/le-hub.apk>

Capacitor enveloppe l'export existant. Le préfixe `/Portail-Applications`
n'existe pas dans une WebView, donc `scripts/build-apk-www.mjs` rebâtit
l'export avec `PORTAIL_BASE` vide, dans `apk/www`.

```sh
npm run apk:sync                 # reconstruit apk/www, puis npx cap sync android
node scripts/build-icones-android.mjs   # seulement si le motif de l'icône change
```

La compilation elle-même demande le SDK Android : elle se fait dans
`.github/workflows/build-apk.yml`, à chaque poussée sur `main`.

### Les quatre secrets de signature

Android n'installe qu'un APK signé, et n'accepte une mise à jour que si elle
porte **la même clé** que la version déjà installée. Cette clé ne doit jamais
entrer dans le dépôt : elle vit dans les secrets, sous
**Settings → Secrets and variables → Actions**.

| Secret | Contenu |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | le fichier `.keystore`, encodé en base64 |
| `ANDROID_KEYSTORE_PASSWORD` | le mot de passe du magasin |
| `ANDROID_KEY_ALIAS` | le nom de la clé dans le magasin |
| `ANDROID_KEY_PASSWORD` | le mot de passe de la clé |

Pour créer la clé, une seule fois, sur une machine avec Java :

```sh
keytool -genkeypair -v -keystore le-hub-release.keystore \
  -alias lehub -keyalg RSA -keysize 2048 -validity 10950 \
  -dname "CN=Le Hub, O=Machines Roger International, C=CA"
base64 -w0 le-hub-release.keystore   # sur macOS : base64 -i le-hub-release.keystore
```

Garder le fichier `.keystore` en lieu sûr, hors du dépôt : **le perdre oblige
à désinstaller l'application sur chaque appareil** avant de pouvoir publier
une mise à jour. Sans les secrets, le workflow s'arrête avec un message
clair plutôt que de publier un APK que personne ne pourrait installer.

### Après une publication

Le bouton de téléchargement du site ne s'affiche que si le fichier existe.
Avant de déployer, relever la release :

```sh
node scripts/relever-apk.mjs      # écrit version, taille et date dans lib/telechargement.ts
```

## Version 1.7.0

- Une section « Emporter Le Hub » sur l'accueil : on installe depuis le
  navigateur, sur Android, iPhone et ordinateur. Le bouton n'apparaît que si
  le navigateur donne vraiment l'invitation ; sinon la phrase nomme le geste
  du menu, plutôt qu'un bouton qui ne ferait rien.
- Le Hub existe aussi en application Android. Elle embarque tout le contenu :
  pages, captures, logos et codes QR. Elle s'ouvre sous terre, sans réseau,
  dès l'installation.
- L'APK est compilé et publié par GitHub Actions
  (`.github/workflows/build-apk.yml`), sous un tag fixe : l'adresse de
  téléchargement ne change jamais. Voir « Application Android » plus bas.
- Le bouton de téléchargement ne s'affiche que si le fichier existe
  vraiment : `scripts/relever-apk.mjs` relève la release avant chaque
  déploiement.
- Ouvert dans l'APK, Le Hub reconnaît la WebView et dit simplement qu'il est
  déjà installé, au lieu de conseiller de l'installer. Il n'y enregistre pas
  non plus de service worker : l'application embarque déjà tout.

## Version 1.6.0

- Un code QR par application, sur sa fiche : on montre l’écran, le téléphone
  d’en face ouvre l’application. Et un code pour le portail lui-même, à
  imprimer et poser au mur.
- Les codes sont générés au build à partir du catalogue
  (`scripts/build-qr.mjs`) : une adresse qui change se répercute toute seule,
  et un code ne peut pas mener ailleurs que le bouton « Ouvrir ».
- Correction d’erreur M, fond blanc en clair comme en sombre : un lecteur a
  besoin de contraste, pas d’un thème.
- Un test régénère chaque code et le compare octet par octet au fichier
  publié ; le validateur vérifie qu’ils sont servis et affichés.

## Version 1.5.0

- Chaque application porte son vrai logo, celui auquel on la reconnaît sur
  son propre écran d'accueil : TMS, Bruit, WIKI SST, RodBot LP et Procédures
  de forage. Les fichiers sont normalisés à 256 px dans `public/logos/`.
- Anatomie 3D garde sa plaque colorée : cette application n'a pas encore de
  logo à elle. Le champ `logo` du catalogue dit laquelle en a un.
- Un test vérifie que chaque logo annoncé existe, et le validateur refuse un
  logo publié qui ne serait affiché nulle part.

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
