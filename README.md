# Le Hub — Portail d’applications

Accueil public des applications de Frank, organisé en collections à la manière
d’un catalogue d’applications. Ce portail ne copie ni les données ni les comptes
des applications : il permet de les découvrir et de les ouvrir.

## Collections

- **Prévention & découverte** : Prévention des TMS, Bruit, WIKI SST — Mines, Anatomie 3D.
- **Forage & procédures** : RodBot LP, Procédures de forage MRI.
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

## Version 1.1.0

- Nouvelle structure d’application : navigation latérale et barre mobile.
- Repérage de la collection active pendant le défilement.
- Sélection à la une hiérarchisée et fiches compactes, sans tronquer les noms.
- Espace de bas de page adapté à la hauteur réelle de la barre mobile.
- Liens natifs utilisables sans JavaScript ; aucun compte, favori ou stockage ajouté.
- Douze tests de catalogue/navigation et validation renforcée de l’export.
