// Fabrique les icônes et l'écran de lancement de l'APK à partir du même
// motif que le site : quatre tuiles sur fond pétrole, dont une cuivre.
// Sans ce script, Capacitor laisse son logo générique dans l'APK.
//
//   node scripts/build-icones-android.mjs
//
// Les PNG produits sont versionnés (la CI ne les régénère pas) : relancer
// le script à la main si le motif ou les couleurs changent.
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Les mêmes jetons que app/globals.css : --petrole, --fond, --cuivre-clair.
const PETROLE = '#094850';
const CLAIR = '#f5f9fa';
const CUIVRE = '#f7a062';

const RES = 'android/app/src/main/res';

// Motif carré : 2 × 2 tuiles de 110, séparées de 22, soit 242 de côté.
function motif(taille) {
  const tuile = (x, y, teinte) =>
    `<rect x="${x}" y="${y}" width="110" height="110" rx="24" fill="${teinte}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${taille}" height="${taille}" viewBox="0 0 242 242">
    ${tuile(0, 0, CLAIR)}${tuile(132, 0, CLAIR)}
    ${tuile(0, 132, CLAIR)}${tuile(132, 132, CUIVRE)}
  </svg>`;
}

const svg = (source) => Buffer.from(source);

async function ecrire(chemin, image) {
  const octets = await image.png().toBuffer();
  writeFileSync(resolve(chemin), octets);
  console.log(`  ${chemin}`);
}

// Le motif posé au centre d'un fond, occupant `part` de la largeur.
async function composer(largeur, hauteur, fond, part) {
  const cote = Math.round(Math.min(largeur, hauteur) * part);
  const dessin = await sharp(svg(motif(cote))).png().toBuffer();
  return sharp(fond).composite([{ input: dessin, gravity: 'centre' }]);
}

const uni = (largeur, hauteur, teinte) =>
  ({ create: { width: largeur, height: hauteur, channels: 4, background: teinte } });

const vide = (cote) =>
  ({ create: { width: cote, height: cote, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });

// Densités Android : le premier nombre est la toile de l'icône adaptative
// (108 dp), le second celle de l'icône classique (48 dp).
const DENSITES = [
  ['mdpi', 108, 48],
  ['hdpi', 162, 72],
  ['xhdpi', 216, 96],
  ['xxhdpi', 324, 144],
  ['xxxhdpi', 432, 192],
];

console.log('Icônes de lancement :');
for (const [densite, adaptative, classique] of DENSITES) {
  // Icône adaptative : le lanceur peut découper un cercle de 72 dp sur les
  // 108 de la toile. Un motif carré n'y entre que s'il mesure au plus
  // 72 / (108 × √2) ≈ 0,47 de la toile, sinon ses coins sont rognés.
  await ecrire(
    `${RES}/mipmap-${densite}/ic_launcher_foreground.png`,
    await composer(adaptative, adaptative, vide(adaptative), 0.47),
  );

  // Icônes classiques, pour les lanceurs qui ignorent l'adaptative.
  await ecrire(
    `${RES}/mipmap-${densite}/ic_launcher.png`,
    await composer(classique, classique, uni(classique, classique, PETROLE), 0.62),
  );

  const rayon = classique / 2;
  const cercle = svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${classique}" height="${classique}">
      <circle cx="${rayon}" cy="${rayon}" r="${rayon}" fill="${PETROLE}"/>
    </svg>`,
  );
  await ecrire(
    `${RES}/mipmap-${densite}/ic_launcher_round.png`,
    await composer(classique, classique, cercle, 0.58),
  );
}

// Écran de lancement : le motif reste petit, il est vu de près.
const ECRANS = [
  ['drawable', 480, 320],
  ['drawable-port-mdpi', 320, 480],
  ['drawable-port-hdpi', 480, 800],
  ['drawable-port-xhdpi', 720, 1280],
  ['drawable-port-xxhdpi', 960, 1600],
  ['drawable-port-xxxhdpi', 1280, 1920],
  ['drawable-land-mdpi', 480, 320],
  ['drawable-land-hdpi', 800, 480],
  ['drawable-land-xhdpi', 1280, 720],
  ['drawable-land-xxhdpi', 1600, 960],
  ['drawable-land-xxxhdpi', 1920, 1280],
];

console.log("Écrans de lancement :");
for (const [dossier, largeur, hauteur] of ECRANS) {
  await ecrire(
    `${RES}/${dossier}/splash.png`,
    await composer(largeur, hauteur, uni(largeur, hauteur, PETROLE), 0.28),
  );
}

// Le fond de l'icône adaptative est une couleur, pas une image.
writeFileSync(
  resolve(`${RES}/values/ic_launcher_background.xml`),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${PETROLE.toUpperCase()}</color>
</resources>
`,
);
console.log(`  ${RES}/values/ic_launcher_background.xml`);
