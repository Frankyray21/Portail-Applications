// Fabrique toutes les icônes du portail à partir du logo, et de lui seul :
// assets/logo-portail.png. Ce fichier n'est pas servi — il est trop gros, et
// tout ce qui doit l'être en sort ici.
//
//   node scripts/build-icones.mjs
//
// Produit le favicon, la marque du bandeau, les icônes du manifeste, les
// icônes de lanceur Android et l'écran de lancement de l'APK. Les PNG sont
// versionnés : relancer le script quand le logo change, jamais retoucher un
// fichier à la main — les familles divergeraient.
import sharp from 'sharp';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const LOGO = resolve('assets/logo-portail.png');
if (!existsSync(LOGO)) {
  console.error(`Logo introuvable : ${LOGO}`);
  process.exit(1);
}

// Le noir du logo, repris comme fond partout où il en faut un.
const NOIR = '#000000';
const RES = 'android/app/src/main/res';

// Le logo porte son mot-symbole « Portail SST / MRI ». En dessous d'une
// centaine de pixels il devient une tache : pour les petites tailles on ne
// garde que la grappe de quatre tuiles. Les bornes sont relevées dans le
// fichier même — les tuiles vont de x 214 à 1036, le cadre rouge s'arrête à
// x 53, et la bande presque noire de y 887 à 911 sépare les tuiles du
// mot-symbole. On laisse une trentaine de pixels d'air autour.
const GRAPPE = { left: 180, top: 106, width: 891, height: 791 };
const MARGE = Math.round((GRAPPE.width - GRAPPE.height) / 2);

const marque = () =>
  sharp(LOGO)
    .extract(GRAPPE)
    .extend({ top: MARGE, bottom: MARGE, background: NOIR })
    .png()
    .toBuffer();

const entier = () => sharp(LOGO).png().toBuffer();

// Le logo est une illustration détaillée : sans quantification, la seule
// icône de 512 px pèse 295 Ko, et tout cela est préchargé pour l'usage hors
// ligne. La palette ramène l'ensemble à une fraction, sans différence
// visible à ces tailles.
const COMPRESSION = { compressionLevel: 9, effort: 10, palette: true, quality: 90, dither: 1 };

async function ecrire(chemin, image) {
  const octets = await image.png(COMPRESSION).toBuffer();
  writeFileSync(resolve(chemin), octets);
  console.log(`  ${chemin} — ${(octets.length / 1024).toFixed(1)} Ko`);
}

// Le dessin posé au centre d'un fond, occupant `part` de la largeur.
async function composer(largeur, hauteur, fond, part, source = entier) {
  const cote = Math.round(Math.min(largeur, hauteur) * part);
  const dessin = await sharp(await source())
    .resize(cote, cote, { fit: 'contain', background: NOIR })
    .png()
    .toBuffer();
  return sharp(fond).composite([{ input: dessin, gravity: 'centre' }]);
}

const uni = (largeur, hauteur) => ({
  create: { width: largeur, height: hauteur, channels: 4, background: NOIR },
});

const vide = (cote) => ({
  create: {
    width: cote,
    height: cote,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
});

const cercle = (cote) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cote}" height="${cote}">
      <circle cx="${cote / 2}" cy="${cote / 2}" r="${cote / 2}" fill="${NOIR}"/>
    </svg>`,
  );

console.log('Source : assets/logo-portail.png');

console.log('Marque et favicon (la grappe seule, lisible en petit) :');
await ecrire('public/marque.png', sharp(await marque()).resize(320, 320));
await ecrire('public/favicon.png', sharp(await marque()).resize(64, 64));

console.log('Icônes du manifeste :');
// Icônes « any » : le logo tel quel, il est déjà une plaque.
for (const cote of [192, 512])
  await ecrire(`public/icone-${cote}.png`, sharp(LOGO).resize(cote, cote));
// iOS arrondit lui-même : on recule un peu pour qu'il ne rogne pas le cadre.
await ecrire('public/apple-touch-icon.png', await composer(180, 180, uni(180, 180), 0.88));
// Icône masquable : Android peut n'en garder qu'un cercle de 80 % du côté.
// Un carré n'y entre qu'au plus à 0,80 / √2 ≈ 0,566 de la toile.
await ecrire('public/icone-maskable-512.png', await composer(512, 512, uni(512, 512), 0.56));

// Densités Android : la toile de l'icône adaptative (108 dp), puis celle de
// l'icône classique (48 dp).
const DENSITES = [
  ['mdpi', 108, 48],
  ['hdpi', 162, 72],
  ['xhdpi', 216, 96],
  ['xxhdpi', 324, 144],
  ['xxxhdpi', 432, 192],
];

console.log('Icônes de lanceur Android :');
for (const [densite, adaptative, classique] of DENSITES) {
  // Le lanceur peut découper un cercle de 72 dp sur les 108 de la toile :
  // un carré n'y entre qu'au plus à 72 / (108 × √2) ≈ 0,47.
  await ecrire(
    `${RES}/mipmap-${densite}/ic_launcher_foreground.png`,
    await composer(adaptative, adaptative, vide(adaptative), 0.47),
  );
  await ecrire(
    `${RES}/mipmap-${densite}/ic_launcher.png`,
    await composer(classique, classique, uni(classique, classique), 0.88),
  );
  await ecrire(
    `${RES}/mipmap-${densite}/ic_launcher_round.png`,
    await composer(classique, classique, cercle(classique), 0.64),
  );
}

// Écran de lancement : vu de près, le logo entier y est lisible.
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

console.log("Écrans de lancement Android :");
for (const [dossier, largeur, hauteur] of ECRANS)
  await ecrire(`${RES}/${dossier}/splash.png`, await composer(largeur, hauteur, uni(largeur, hauteur), 0.38));

// Le fond de l'icône adaptative est une couleur, pas une image.
writeFileSync(
  resolve(`${RES}/values/ic_launcher_background.xml`),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#000000</color>
</resources>
`,
);
console.log(`  ${RES}/values/ic_launcher_background.xml`);
