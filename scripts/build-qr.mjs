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
// qui arrive à une feuille affichée dans un atelier. Exporté parce que le
// test régénère les codes avec exactement ces options : les recopier
// ailleurs, c'est se garantir une divergence le jour où l'encre change.
/** @type {import('qrcode').QRCodeToStringOptions} */
export const OPTIONS = {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 3,
  // La même encre que --encre dans app/globals.css, sur fond blanc : un
  // lecteur a besoin de contraste, pas d'un thème.
  color: { dark: '#15171a', light: '#ffffff' },
};

const codes = [
  ['portail', URL_PUBLIQUE],
  ...APPLICATIONS.map((app) => [app.id, app.url]),
];

let total = 0;
for (const [nom, cible] of codes) {
  const svg = await QRCode.toString(cible, OPTIONS);
  writeFileSync(resolve(dossier, `${nom}.svg`), svg);
  total += svg.length;
}
console.log(
  `Codes QR écrits : ${codes.length} (${(total / 1024).toFixed(1)} Ko), depuis le catalogue.`,
);
