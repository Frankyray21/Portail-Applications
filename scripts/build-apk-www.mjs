import { execFileSync } from 'node:child_process';
import { cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// L'APK embarque le site servi à la RACINE : sur GitHub Pages il vit sous
// /Portail-Applications/, mais dans une WebView Android ce préfixe n'existe
// pas et toutes les ressources tomberaient en 404. On reconstruit donc avec
// PORTAIL_BASE vide, et on copie le résultat dans apk/www.
const www = resolve('apk/www');
rmSync(www, { recursive: true, force: true });
rmSync(resolve('dist'), { recursive: true, force: true });

execFileSync(
  'node',
  ['./node_modules/vinext/dist/cli.js', 'build'],
  { stdio: 'inherit', env: { ...process.env, PORTAIL_BASE: '' } },
);

const sortie = resolve('dist/client');
if (!existsSync(sortie)) throw new Error('export introuvable : dist/client');
cpSync(sortie, www, { recursive: true });

// Pas de service worker embarqué : l'application EST le cache, et un worker
// qui tenterait de mettre en cache une origine locale n'apporterait rien.
rmSync(resolve(www, 'sw.js'), { force: true });

const fichiers = readdirSync(www);
if (!fichiers.includes('index.html'))
  throw new Error('apk/www sans index.html');
console.log(
  `Contenu embarqué prêt : apk/www (${fichiers.length} entrées à la racine).`,
);
