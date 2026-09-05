# Le Hub — Portail d’applications

Accueil public des applications de Frank, organisé en collections à la manière
d’un catalogue d’applications. Ce portail ne copie ni les données ni les comptes
des applications : il permet de les découvrir et de les ouvrir.

## Collections

- **Prévention & découverte** : Prévention des TMS, Bruit, WIKI SST — Mines, Anatomie 3D.
- **Formation & forage** : RodBot LP, Procédures de forage.
- **La vie pratique** : Camping en tente, GlucideNet.
- **À la une** : sélection éditoriale de trois applications, sans classement,
  notes, avis ou statistiques de téléchargement inventés.

Les URL publiques des huit applications ont été vérifiées le 5 septembre 2026.
Aucun dépôt privé n’est affiché. Pas de mesure d’audience, de compte ou de
stockage partagé ajouté au portail. Chaque application garde son fonctionnement.

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

Le contenu est centralisé dans `lib/catalogue.ts` : nom, description, collection,
adresse publique et icône. Ajouter une application explicitement après avoir
vérifié son accès public. Ne pas importer automatiquement tous les dépôts du
compte. Les textes sont descriptifs ; ils ne valident pas le contenu médical,
réglementaire ou technique des applications liées.

## Publication

Destination prévue : `https://frankyray21.github.io/Portail-Applications/`.

Le workflow vérifie les tests, construit l’export puis publie sur GitHub Pages
après fusion dans `main`. Dans les réglages du dépôt, section Pages, la source
doit être **GitHub Actions**. Si le nom du dépôt change, modifier `basePath` dans
`next.config.ts`, le lien GitHub du pied de page et l’adresse du favicon.

Version initiale : **1.0.0**.
