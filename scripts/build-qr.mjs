import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import QRCode from 'qrcode';
import { APPLICATIONS } from '../lib/catalogue.ts';
import { URL_PUBLIQUE } from '../lib/base.ts';

// Les codes QR sont générés à partir du catalogue, jamais écrits à la main :
// une adresse qui change se répercute au prochain build, et un code affiché
// au mur ne peut pas mener ailleurs que là où mène le bouton « Ouvrir ».
const dossier = resolve('public/qr');
mkdirSync(dossier, { recursive: true });

// Correction d'erreur M : un code qui tient même un peu abîmé ou sali, ce
// qui arrive à une feuille affichée dans un atelier.
const options = {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 3,
  color: { dark: '#101d21', light: '#ffffff' },
};

const codes = [
  ['portail', URL_PUBLIQUE],
  ...APPLICATIONS.map((app) => [app.id, app.url]),
];

let total = 0;
for (const [nom, cible] of codes) {
  const svg = await QRCode.toString(cible, options);
  writeFileSync(resolve(dossier, `${nom}.svg`), svg);
  total += svg.length;
}
console.log(
  `Codes QR écrits : ${codes.length} (${(total / 1024).toFixed(1)} Ko), depuis le catalogue.`,
);
