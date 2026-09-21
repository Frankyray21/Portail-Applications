# Portail SST — MRI

Boutique publique des applications santé et sécurité de Machines Roger
International. Chaque application a sa fiche :
présentation, ce qu’elle contient, captures d’écran, et un bouton pour
l’installer. Le portail ne copie ni les données ni les comptes des applications.

Deux onglets : **Découvrir** (la une et les essentiels) et **Applications**
(le catalogue par collection). La recherche est un champ du bandeau, présent
sur toutes les pages : elle filtre sur le nom, les thèmes et le contenu des
fiches.

## Collections

- **Prévention & découverte** : Prévention des TMS, Bruit, WIKI SST — Mines.
- **Forage & procédures** : RodBot LP, Procédures de forage MRI.

Aucune note, aucune étoile, aucun avis, aucun compteur de téléchargement,
aucun classement : rien de tout cela n’existe, donc rien de tout cela n’est
affiché. Un test du catalogue et le validateur d’export le vérifient à chaque
construction. La mise en avant de l’onglet « Découvrir » se règle dans
`A_LA_UNE` (`lib/catalogue.ts`) ; chaque entrée doit porter une raison
vérifiable dans l’application elle-même.

Les URL publiques des cinq applications ont été vérifiées le 5 septembre 2026.
Aucun dépôt privé n’est affiché. Pas de mesure d’audience, de compte ou de
stockage partagé ajouté au portail. Chaque application garde son fonctionnement.

## Identité visuelle

Deux couleurs et deux caractères, rien d’autre.

- Les couleurs sont celles de **Machines Roger International**, relevées sur
  le logo : rouge `#d22325` sur noir. Le **noir** (`--noir`) porte la
  coquille (bandeau, onglets) ; le **rouge** (`--rouge`) porte l’action
  (bouton « Ouvrir », liens, onglet courant, barre sous les titres). Les
  neutres sont franchement gris : la couleur vient du rouge et du noir, de
  rien d’autre.
- Le rouge du logo est trop clair pour écrire sur fond pâle : il est
  assombri à `#b81b1d` pour le texte et éclairci à `#ef5a5c` sur le noir. Le
  rouge exact reste celui des aplats. Chaque valeur d’`app/globals.css`
  porte son ratio de contraste en commentaire.
- **Hepta Slab 800** grave les titres et le nom du portail ;
  **Atkinson Hyperlegible Next**, dessinée pour les lecteurs peu à l’aise,
  compose tout le reste. Les deux fichiers woff2 (sous-ensemble latin, 57 Ko
  en tout) sont dans `app/fonts/`, sous licence OFL (`app/fonts/OFL.txt`) ;
  la construction les copie dans `_next/static/media/` avec le chemin de
  base. Sans eux, le site retombe sur la police système et reste lisible.
- **Le sombre est le thème du portail**, pas une variante : il s'applique
  quel que soit le réglage de l'appareil. Sous terre et sur une tablette de
  terrain, c'est celui qu'on veut. Le clair reste atteignable par le bouton
  du bandeau, et le choix est gardé sur l'appareil (`localStorage`). Un
  petit script en tête de page le rétablit avant le premier affichage, donc
  sans clignotement ; sans JavaScript le bouton ne s'affiche pas, puisqu'il
  ne ferait rien.
- Le favicon reprend la marque : quatre plaques, dont une en rouge. Toutes
  les icônes (site, lanceur Android, écran de lancement) sortent du même
  motif, par `node scripts/build-icones.mjs`.

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

Le portail existe aussi en APK : le site entier, embarqué, qui s'ouvre sans
réseau dès l'installation. Le fichier est toujours à la même adresse :

<https://github.com/Frankyray21/Portail-Applications/releases/download/apk-latest/portail-sst-mri.apk>

Capacitor enveloppe l'export existant. Le préfixe `/Portail-Applications`
n'existe pas dans une WebView, donc `scripts/build-apk-www.mjs` rebâtit
l'export avec `PORTAIL_BASE` vide, dans `apk/www`.

```sh
npm run apk:sync                 # reconstruit apk/www, puis npx cap sync android
node scripts/build-icones.mjs   # seulement si le motif de l'icône change
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
| `ANDROID_KEY_ALIAS` | le nom de la clé dans le magasin (`portailsst`) |
| `ANDROID_KEY_PASSWORD` | le mot de passe de la clé |

#### 1. Créer la clé, une seule fois

Il faut `keytool`, qui vient avec Java. S'il est introuvable, installer un JDK
(<https://adoptium.net>) ; Android Studio en embarque un aussi.

```sh
keytool -genkeypair -v -keystore portail-sst-release.keystore \
  -alias portailsst -keyalg RSA -keysize 2048 -validity 10950 \
  -dname "CN=Portail SST MRI, O=Machines Roger International, C=CA"
```

La commande demande un mot de passe, deux fois, puis celui de la clé : appuyer
sur **Entrée** pour reprendre le même. Les deux secrets de mot de passe auront
donc la même valeur. Choisir un mot de passe et le noter quelque part de sûr.

#### 2. Encoder le fichier en base64

Le secret ne contient pas le fichier mais son encodage. Selon le système,
une seule ligne, qui met le résultat dans le presse-papiers :

```powershell
# Windows, dans PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("portail-sst-release.keystore")) | Set-Clipboard
```

```sh
# macOS
base64 -i portail-sst-release.keystore | pbcopy

# Linux
base64 -w0 portail-sst-release.keystore | xclip -selection clipboard
```

#### 3. Coller les quatre secrets

Sur <https://github.com/Frankyray21/Portail-Applications/settings/secrets/actions>,
bouton **New repository secret**, une fois par ligne du tableau ci-dessus.
`ANDROID_KEY_PASSWORD` reprend la même valeur que `ANDROID_KEYSTORE_PASSWORD`
si on a appuyé sur Entrée à l'étape 1.

La compilation part toute seule à la poussée suivante sur `main`, ou
immédiatement depuis l'onglet **Actions → Build Android APK → Run workflow**.

#### Et ensuite

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

## Version 1.12.0

- Le portail propose d'**installer** chaque application plutôt que de
  l'ouvrir : sous terre, une application posée sur l'écran d'accueil s'ouvre
  sans réseau.
- Un site ne peut pas installer la PWA d'un autre site — `beforeinstallprompt`
  ne concerne que sa propre origine et `navigator.install` n'existe pas encore.
  Le bouton ouvre donc l'application, et c'est le navigateur qui propose de
  l'ajouter. Le portail le dit dans son chapeau et sur chaque fiche, avec le
  geste iPhone (`Partager`, puis `Sur l'écran d'accueil`).
- Le champ `installable` du catalogue est relevé dans chaque application
  publiée : manifeste lié, `display: standalone`, icônes 192/512/masquable et
  service worker. Les cinq les ont, vérifié le 21 septembre 2026. Une
  application qui ne les aurait pas garderait « Ouvrir ».

## Version 1.11.0

- **Le logo du portail est en place.** `assets/logo-portail.png` est la seule
  source : `node scripts/build-icones.mjs` en tire le favicon, la marque du
  bandeau, les icônes du manifeste, celles du lanceur Android et l'écran de
  lancement de l'APK. Le fichier source n'est pas servi.
- Aux petites tailles, le script ne garde que la **grappe de quatre tuiles**
  du logo : le mot-symbole « Portail SST / MRI » y deviendrait une tache. Les
  bornes de la découpe sont relevées dans le fichier lui-même.
- Les icônes sont quantifiées en palette. Sans ça la seule icône de 512 px
  pesait 295 Ko, et tout est préchargé pour l'usage hors ligne : le lot passe
  de 1,65 à 1,20 Mo, sans différence visible.
- **L'onglet « Rechercher » disparaît de la navigation.** Le champ de
  recherche est dans le bandeau, sur toutes les pages : un onglet de plus
  répétait le même geste et prenait la place dont le champ avait besoin.
  L'invite complète de la maquette tient maintenant à vingt largeurs, de 320
  à 1920 px, avec les deux types de pointeur.

## Version 1.10.0

- **Le sombre est le thème du portail**, quel que soit le réglage de
  l'appareil. Sous terre et sur une tablette de terrain, c'est celui qu'on
  veut. Le clair reste atteignable par un bouton dans le bandeau, et le
  choix est gardé sur l'appareil. Un script en tête de page le rétablit
  avant le premier affichage, donc sans clignotement ; sans JavaScript le
  bouton ne s'affiche pas, puisqu'il ne ferait rien.
- **Optimisé pour la Galaxy Tab Active4 Pro** (1920 × 1200 à densité 1,5,
  soit 1280 × 800 px CSS en paysage). En paysage l'écran n'a que 800 px de
  haut : le titre et la une se resserrent pour que « Les essentiels » reste
  au-dessus de la ligne de flottaison.
- **Manipulable avec des gants** : sur un pointeur grossier, les commandes
  principales passent de 44 à 48 px. Les noms d'application, qui mènent à la
  fiche, voient leur cible portée à 44 px sans que le texte bouge.
- Le bandeau tient à onze largeurs de 320 à 1920 px, avec les deux types de
  pointeur : aucun débordement, et l'invite du champ de recherche entière.
  Entre 901 et 1010 px, le champ descend sur sa propre ligne.
- Les vingt textes de l'accueil sont mesurés dans le navigateur, dans les
  deux thèmes : tous au niveau AA.

## Version 1.9.0

- **Nouvelle mise en page de la page d'accueil**, d'après la maquette.
  Une bande « à la une » en cartes rouges : une grande carte avec sa capture,
  deux plus petites à côté. Puis **Les essentiels**, toutes les applications
  en tuiles avec leur logo, leur thème, ce qu'elles contiennent en une
  phrase, et un bouton **Ouvrir**.
- Deux gestes, jamais mélangés : le **nom** mène à la fiche, le **bouton**
  ouvre l'application. Aucun lien dans un lien.
- Un **champ de recherche dans la barre du haut**, sur toutes les pages.
  C'est un formulaire : sans JavaScript, il mène à la page de recherche et
  sa liste complète ; avec, le terme est repris et filtre tout de suite.
- L'onglet **Aujourd'hui** s'appelle maintenant **Découvrir** — le nom venait
  du calque App Store, où c'est un fil éditorial qui change chaque jour.
  L'icône suit (une maison plutôt que des étincelles).
- **Aucun nom propre sur le site.** Le portail parle d'outils de travail,
  plus de la collection d'une personne. La mention de l'accueil reste
  entière : ces applications ne remplacent ni les procédures officielles
  d'un employeur, ni un avis professionnel.
- Pas de carrousel : il demanderait du JavaScript, cacherait deux cartes sur
  trois et se manipule mal avec des gants. Les cartes se réorganisent en
  grille (quatre colonnes, puis deux, puis une).

## Version 1.8.0

- Les couleurs du portail sont celles de **Machines Roger International** :
  rouge sur noir, relevé sur le logo, comme Procédures de forage. Les
  neutres passent au gris franc. Tous les ratios de contraste sont
  recalculés et notés dans `app/globals.css`.
- Le portail s'appelle **Portail SST — MRI**. Le nom change partout : en-tête,
  titres de pages, manifeste, application Android (`com.machinesroger.portailsst`)
  et nom du fichier APK.
- **Anatomie 3D** sort du catalogue. Le portail compte cinq applications, en
  deux collections.
- Toutes les icônes sortent maintenant d'un seul script,
  `scripts/build-icones.mjs` : favicon d'application, icônes de lanceur
  Android et écran de lancement ne peuvent plus diverger.
- Le test des codes QR importe les options du générateur au lieu de les
  recopier : changer l'encre à un seul endroit suffit.

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
