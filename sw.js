// Généré par scripts/build-sw.mjs — ne pas modifier à la main.
const CACHE = 'portail-sst-23441a8397e6';
const BASE = "/Portail-Applications/";
const PRECACHE = [
  "/Portail-Applications/_next/static/3948e1f0-4358-4358-80af-73d3836e3f25/_buildManifest.js",
  "/Portail-Applications/_next/static/3948e1f0-4358-4358-80af-73d3836e3f25/_ssgManifest.js",
  "/Portail-Applications/_next/static/chunks/Icon-jpk45vUa.js",
  "/Portail-Applications/_next/static/chunks/base-CzHLMv67.js",
  "/Portail-Applications/_next/static/chunks/createLucideIcon-C0Hk8rLa.js",
  "/Portail-Applications/_next/static/chunks/framework-DTZGTDtF.js",
  "/Portail-Applications/_next/static/chunks/hybrid-client-route-owner-D6EudrM1.js",
  "/Portail-Applications/_next/static/chunks/index-guNfzwXh.js",
  "/Portail-Applications/_next/static/chunks/installer-mxA_jDq1.js",
  "/Portail-Applications/_next/static/chunks/layout-segment-context-B4pdTH4A.js",
  "/Portail-Applications/_next/static/chunks/link-BjLJ7PUH.js",
  "/Portail-Applications/_next/static/chunks/query-DugiHe4Q.js",
  "/Portail-Applications/_next/static/chunks/recherche-Zel1_xda.js",
  "/Portail-Applications/_next/static/chunks/rolldown-runtime-hePW80VL.js",
  "/Portail-Applications/_next/static/chunks/theme-CurTP_N7.js",
  "/Portail-Applications/_next/static/chunks/vinext-DH_QHXkP.js",
  "/Portail-Applications/_next/static/css/index.CXdpu-UR.css",
  "/Portail-Applications/_next/static/media/AtkinsonHyperlegibleNext.BcXVPD7q.woff2",
  "/Portail-Applications/_next/static/media/HeptaSlab-800.DbfWV3Kq.woff2",
  "/Portail-Applications/app/bruit/index.html",
  "/Portail-Applications/app/procedures/index.html",
  "/Portail-Applications/app/rodbot/index.html",
  "/Portail-Applications/app/tms/index.html",
  "/Portail-Applications/app/wiki/index.html",
  "/Portail-Applications/apple-touch-icon.png",
  "/Portail-Applications/applications/index.html",
  "/Portail-Applications/favicon.png",
  "/Portail-Applications/icone-192.png",
  "/Portail-Applications/icone-512.png",
  "/Portail-Applications/icone-maskable-512.png",
  "/Portail-Applications/index.html",
  "/Portail-Applications/logos/bruit.png",
  "/Portail-Applications/logos/procedures.png",
  "/Portail-Applications/logos/rodbot.png",
  "/Portail-Applications/logos/tms.png",
  "/Portail-Applications/logos/wiki.png",
  "/Portail-Applications/manifest.webmanifest",
  "/Portail-Applications/marque.png",
  "/Portail-Applications/qr/bruit.svg",
  "/Portail-Applications/qr/portail.svg",
  "/Portail-Applications/qr/procedures.svg",
  "/Portail-Applications/qr/rodbot.svg",
  "/Portail-Applications/qr/tms.svg",
  "/Portail-Applications/qr/wiki.svg",
  "/Portail-Applications/recherche/index.html"
];

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
