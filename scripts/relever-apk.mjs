// Relève la release de l'APK sur GitHub et écrit ce qu'elle contient dans
// lib/telechargement.ts. À lancer avant un déploiement, après que le
// workflow « Build Android APK » a publié.
//
//   node scripts/relever-apk.mjs
//
// Sans réseau, le fichier n'est pas touché : un build hors ligne garde la
// dernière situation connue au lieu d'effacer le bouton de téléchargement.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CIBLE = resolve('lib/telechargement.ts');
const API =
  'https://api.github.com/repos/Frankyray21/Portail-Applications/releases/tags/apk-latest';

function ecrire(champs) {
  let source = readFileSync(CIBLE, 'utf8');
  for (const [cle, valeur] of Object.entries(champs)) {
    const motif = new RegExp(`^(  ${cle}: ).*,$`, 'm');
    if (!motif.test(source))
      throw new Error(`champ « ${cle} » introuvable dans ${CIBLE}`);
    source = source.replace(motif, `$1${JSON.stringify(valeur)},`);
  }
  writeFileSync(CIBLE, source);
}

let reponse;
try {
  reponse = await fetch(API, {
    headers: { accept: 'application/vnd.github+json' },
  });
} catch (erreur) {
  console.log(`Pas de réseau (${erreur.message}) : lib/telechargement.ts reste tel quel.`);
  process.exit(0);
}

if (reponse.status === 404) {
  ecrire({ publie: false, version: '', taille: '', date: '' });
  console.log('Aucune release apk-latest : le bouton reste caché.');
  process.exit(0);
}
if (!reponse.ok) {
  console.log(`GitHub répond ${reponse.status} : lib/telechargement.ts reste tel quel.`);
  process.exit(0);
}

const release = await reponse.json();
const apk = (release.assets ?? []).find((a) => a.name === 'le-hub.apk');
if (!apk) {
  ecrire({ publie: false, version: '', taille: '', date: '' });
  console.log("La release existe mais n'a pas de le-hub.apk : bouton caché.");
  process.exit(0);
}

// La version est celle du site au moment de la compilation ; elle est dans
// le nom de la release, entre parenthèses.
const version = /\(([\d.]+)\)/.exec(release.name ?? '')?.[1] ?? '';
const taille = `${(apk.size / 1_000_000).toFixed(1).replace('.', ',')} Mo`;
const date = new Date(apk.updated_at).toLocaleDateString('fr-CA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

ecrire({ publie: true, version, taille, date });
console.log(`APK publié : version ${version || '?'}, ${taille}, ${date}.`);
