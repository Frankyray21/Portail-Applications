// Fabrique toutes les icônes du portail à partir d'un seul motif : quatre
// tuiles sur fond noir, dont une rouge. Les couleurs sont celles de
// Machines Roger International, relevées sur le logo.
//
//   node scripts/build-icones.mjs
//
// Produit le favicon d'application (PWA), les icônes de lanceur Android et
// l'écran de lancement de l'APK. Sans ce script, Capacitor laisse son logo
// générique dans l'APK et les trois familles d'icônes dérivent.
//
// Les PNG produits sont versionnés : relancer le script à la main quand le
// motif ou les couleurs changent.
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Les mêmes jetons que app/globals.css : --noir, --fond, --rouge-clair.
const NOIR = '#101214';
const CLAIR = '#f6f6f7';
const ROUGE = '#ef5a5c';

const RES = 'android/app/src/main/res';

// Motif carré : 2 × 2 tuiles de 110, séparées de 22, soit 242 de côté.
function motif(taille) {
  const tuile = (x, y, teinte) =>
    `<rect x="${x}" y="${y}" width="110" height="110" rx="24" fill="${teinte}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${taille}" height="${taille}" viewBox="0 0 242 242">
    ${tuile(0, 0, CLAIR)}${tuile(132, 0, CLAIR)}
    ${tuile(0, 132, CLAIR)}${tuile(132, 132, ROUGE)}
  </svg>`;
}

const svg = (source) => Buffer.from(source);

async function ecrire(chemin, image) {
  writeFileSync(resolve(chemin), await image.png().toBuffer());
  console.log(`  ${chemin}`);
}

// Le motif posé au centre d'un fond, occupant `part` de la largeur.
async function composer(largeur, hauteur, fond, part) {
  const cote = Math.round(Math.min(largeur, hauteur) * part);
  const dessin = await sharp(svg(motif(cote))).png().toBuffer();
  return sharp(fond).composite([{ input: dessin, gravity: 'centre' }]);
}

const uni = (largeur, hauteur, teinte) => ({
  create: { width: largeur, height: hauteur, channels: 4, background: teinte },
});

const vide = (cote) => ({
  create: {
    width: cote,
    height: cote,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
});

// Carré noir aux coins arrondis, comme une plaque d'application.
const plaque = (cote) =>
  svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cote}" height="${cote}">
      <rect width="${cote}" height="${cote}" rx="${Math.round(cote * 0.195)}" fill="${NOIR}"/>
    </svg>`,
  );

console.log('Icônes du site :');
// Icônes « any » du manifeste : la plaque telle qu'elle s'affiche.
for (const cote of [192, 512]) {
  await ecrire(`public/icone-${cote}.png`, await composer(cote, cote, plaque(cote), 0.47));
}
// iOS applique lui-même son masque : le fond doit remplir le carré.
await ecrire('public/apple-touch-icon.png', await composer(180, 180, uni(180, 180, NOIR), 0.47));
// Icône masquable : Android peut y découper un cercle de 80 % du côté, donc
// un motif carré n'y entre qu'au plus à 0,80 / √2 ≈ 0,56 de la toile.
await ecrire(
  'public/icone-maskable-512.png',
  await composer(512, 512, uni(512, 512, NOIR), 0.47),
);

// Densités Android : le premier nombre est la toile de l'icône adaptative
// (108 dp), le second celle de l'icône classique (48 dp).
const DENSITES = [
  ['mdpi', 108, 48],
  ['hdpi', 162, 72],
  ['xhdpi', 216, 96],
  ['xxhdpi', 324, 144],
  ['xxxhdpi', 432, 192],
];

console.log('Icônes de lancement Android :');
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
    await composer(classique, classique, uni(classique, classique, NOIR), 0.62),
  );

  const rayon = classique / 2;
  const cercle = svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${classique}" height="${classique}">
      <circle cx="${rayon}" cy="${rayon}" r="${rayon}" fill="${NOIR}"/>
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

console.log('Écrans de lancement Android :');
for (const [dossier, largeur, hauteur] of ECRANS) {
  await ecrire(
    `${RES}/${dossier}/splash.png`,
    await composer(largeur, hauteur, uni(largeur, hauteur, NOIR), 0.28),
  );
}

// Le fond de l'icône adaptative est une couleur, pas une image.
writeFileSync(
  resolve(`${RES}/values/ic_launcher_background.xml`),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${NOIR.toUpperCase()}</color>
</resources>
`,
);
console.log(`  ${RES}/values/ic_launcher_background.xml`);
