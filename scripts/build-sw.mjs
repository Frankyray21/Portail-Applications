import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join, relative, sep } from 'node:path';

// Le service worker est écrit APRÈS la construction, pour qu'il connaisse le
// nom réel des actifs versionnés de _next. Sans ça, une installation hors
// ligne rendrait les pages sans leur feuille de style.
const base = '/Portail-Applications/';
const dossier = resolve('dist/client/Portail-Applications');

function fichiers(racine, prefixe = '') {
  const sortie = [];
  for (const nom of readdirSync(join(racine, prefixe))) {
    const chemin = join(prefixe, nom);
    if (statSync(join(racine, chemin)).isDirectory())
      sortie.push(...fichiers(racine, chemin));
    else sortie.push(chemin.split(sep).join('/'));
  }
  return sortie;
}

const tous = fichiers(dossier);
// Les captures d'écran sont mises en cache à l'usage : les précharger
// doublerait le poids de l'installation pour des images qu'on ne regarde
// qu'une fois.
const precache = tous
  .filter((f) => !f.startsWith('captures/'))
  .filter((f) => !f.endsWith('.txt'))
  .map((f) => base + f);

const empreinte = createHash('sha256')
  .update(
    precache
      .map((f) => f + ':' + statSync(join(dossier, relative(base, f) || f.slice(base.length))).size)
      .join('|'),
  )
  .digest('hex')
  .slice(0, 12);

const sw = `// Généré par scripts/build-sw.mjs — ne pas modifier à la main.
const CACHE = 'portail-sst-${empreinte}';
const BASE = ${JSON.stringify(base)};
const PRECACHE = ${JSON.stringify(precache, null, 2)};

self.addEventListener('install', (evenement) => {
  evenement.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches
      .keys()
      .then((noms) =>
        Promise.all(
          noms.filter((nom) => nom !== CACHE).map((nom) => caches.delete(nom)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET') return;
  const url = new URL(requete.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE))
    return;

  // Les pages : le réseau d'abord, pour qu'une nouvelle version arrive dès
  // qu'il y a du signal ; le cache prend le relais sous terre.
  if (requete.mode === 'navigate') {
    evenement.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(CACHE).then((cache) => cache.put(requete, copie));
          return reponse;
        })
        .catch(() =>
          caches
            .match(requete)
            .then((cache) => cache || caches.match(BASE)),
        ),
    );
    return;
  }

  // Les actifs : le cache d'abord, ils portent leur version dans leur nom.
  evenement.respondWith(
    caches.match(requete).then(
      (cache) =>
        cache ||
        fetch(requete).then((reponse) => {
          if (reponse.ok && reponse.type === 'basic') {
            const copie = reponse.clone();
            caches.open(CACHE).then((c) => c.put(requete, copie));
          }
          return reponse;
        }),
    ),
  );
});
`;

writeFileSync(join(dossier, 'sw.js'), sw);
const poids = precache.reduce(
  (total, f) => total + statSync(join(dossier, f.slice(base.length))).size,
  0,
);
console.log(
  `Service worker écrit : ${precache.length} fichiers préchargés, ${(poids / 1048576).toFixed(2)} Mo, cache portail-sst-${empreinte}.`,
);
