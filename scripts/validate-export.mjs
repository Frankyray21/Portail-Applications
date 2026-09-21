import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const base = '/Portail-Applications/';
const dossier = resolve('dist/client/Portail-Applications');
const APPS = [
  'tms',
  'bruit',
  'wiki',
  'rodbot',
  'procedures',
];
const PAGES = [
  ['', 'Accueil'],
  ['applications/', 'Applications'],
  ['recherche/', 'Rechercher'],
  ...APPS.map((id) => [`app/${id}/`, null]),
];

const lu = (chemin) => readFileSync(join(dossier, chemin, 'index.html'), 'utf8');
const sansScript = (html) =>
  html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

const ressources = new Set();
for (const [chemin, titreH1] of PAGES) {
  const html = lu(chemin);
  const page = sansScript(html);
  const ou = chemin || '(accueil)';
  assert.ok(page.includes('<html lang="fr-CA">'), `langue : ${ou}`);
  assert.equal((page.match(/<h1\b/g) ?? []).length, 1, `un seul h1 : ${ou}`);
  assert.ok(page.includes('href="#contenu"'), `lien d’évitement : ${ou}`);
  assert.ok(
    page.includes(`href="${base}manifest.webmanifest"`),
    `manifeste non lié : ${ou}`,
  );
  assert.ok(
    page.includes('aria-label="Navigation principale"') &&
      page.includes('aria-label="Navigation"'),
    `navigation : ${ou}`,
  );
  if (titreH1) assert.ok(page.includes(`>${titreH1}<`), `titre : ${ou}`);
  // Aucune popularité fabriquée nulle part dans le rendu. On vise les
  // chiffres, pas les mots : la page a le droit de dire qu'elle n'affiche
  // « aucune note, aucun avis ».
  const texte = page.replace(/<[^>]+>/g, ' ');
  for (const invente of [
    /[★☆]/,
    /\b\d+([.,]\d+)?\s*(?:sur|\/)\s*5\b/,
    /\b\d[\d\s.,]*\s*(?:téléchargements?|avis|notes?)\b/i,
    /\bclassement\b/i,
    /\bmeilleures? applications?\b/i,
  ])
    assert.doesNotMatch(texte, invente, `popularité inventée : ${ou}`);
  // Toute ouverture d’onglet externe reste protégée.
  for (const lien of page.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g))
    assert.ok(lien[1].includes('rel="noopener noreferrer"'), `rel : ${ou}`);
  assert.ok(!/<(?:script|iframe)[^>]+src="https?:/i.test(html), `externe : ${ou}`);
  // Toute URL absolue du site doit porter le chemin de base : sans lui,
  // GitHub Pages renvoie 404 et l'image ne s'affiche jamais.
  for (const m of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) {
    const url = m[1];
    if (url.startsWith('//')) continue;
    assert.ok(
      url.startsWith(base),
      `chemin de base absent sur ${ou} : ${url}`,
    );
    ressources.add(url);
  }
}

// La liste mène aux fiches, pas directement aux applications : c’est la
// fiche qui porte le bouton « Ouvrir ».
const liste = sansScript(lu('applications/'));
assert.equal(
  (liste.match(/class="rangee"/g) ?? []).length,
  APPS.length,
  'six rangées',
);
assert.ok(
  !liste.includes('frankyray21.github.io'),
  'la liste ne doit pas ouvrir les applications directement',
);
for (const id of APPS)
  assert.ok(liste.includes(`data-app-id="${id}"`), `rangée manquante : ${id}`);

// Chaque fiche ouvre son application et montre au moins une capture.
for (const id of APPS) {
  const fiche = sansScript(lu(`app/${id}/`));
  const ouvre = [
    ...fiche.matchAll(/href="(https:\/\/frankyray21\.github\.io\/[^"]+)"/g),
  ];
  assert.ok(ouvre.length >= 1, `aucune ouverture : ${id}`);
  // Une fiche peut pointer profond dans SON application (les sujets du
  // wiki), mais jamais vers une autre : tous ses liens publics doivent
  // partir de l'adresse que son bouton « Ouvrir » annonce.
  const bouton = fiche.match(/class="ouvrir"[^>]*href="([^"]+)"/) ??
    fiche.match(/href="([^"]+)"[^>]*class="ouvrir"/);
  assert.ok(bouton, `bouton Ouvrir introuvable : ${id}`);
  for (const lien of ouvre)
    assert.ok(
      lien[1].startsWith(bouton[1]),
      `la fiche ${id} mène hors de son application : ${lien[1]}`,
    );
  assert.ok(
    /href="https:\/\/github\.com\/Frankyray21\//.test(fiche),
    `code source absent : ${id}`,
  );
  const images = [...fiche.matchAll(/\/captures\/([\w-]+)\.jpg/g)];
  assert.ok(images.length >= 1, `aucune capture : ${id}`);
  for (const image of images)
    assert.ok(image[1].startsWith(`${id}-`), `capture étrangère : ${id}`);
  assert.ok(fiche.includes('class="ouvrir"'), `bouton Ouvrir : ${id}`);
}

// Le fond documentaire : les sept sujets du wiki doivent être offerts sur
// l'accueil et sur la fiche, et mener dans le wiki, pas ailleurs.
const SUJETS = [
  'w/psychosocial/',
  'w/legislation/',
  'w/ergonomie/',
  'w/hygiene/',
  'w/securite/',
  'w/toxicologie/',
  'w/droit-travail/',
];
for (const ou of ['', 'app/wiki/']) {
  const page = sansScript(lu(ou));
  for (const sujet of SUJETS)
    assert.ok(
      page.includes(`https://frankyray21.github.io/wiki-sst-mines/${sujet}`),
      `sujet du wiki absent de ${ou || '(accueil)'} : ${sujet}`,
    );
  assert.equal(
    (page.match(/class="sujets__titre"/g) ?? []).length,
    SUJETS.length,
    `sept sujets attendus sur ${ou || '(accueil)'}`,
  );
}

// Application installable : le manifeste, les icônes et le service worker
// doivent être là, cohérents, et tout porter le chemin de base.
const manifeste = JSON.parse(
  readFileSync(join(dossier, 'manifest.webmanifest'), 'utf8'),
);
for (const chemin of [
  manifeste.start_url,
  manifeste.scope,
  manifeste.id,
  ...manifeste.icons.map((icone) => icone.src),
  ...manifeste.shortcuts.flatMap((r) => [r.url, ...r.icons.map((i) => i.src)]),
])
  assert.ok(chemin.startsWith(base), `manifeste hors base : ${chemin}`);
assert.equal(manifeste.display, 'standalone');
for (const icone of manifeste.icons)
  assert.ok(
    existsSync(resolve(dossier, icone.src.slice(base.length))),
    `icône manquante : ${icone.src}`,
  );
for (const taille of ['192x192', '512x512'])
  assert.ok(
    manifeste.icons.some((icone) => icone.sizes === taille),
    `icône ${taille} absente : l'application ne serait pas installable`,
  );
assert.ok(
  manifeste.icons.some((icone) => icone.purpose === 'maskable'),
  'aucune icône maskable',
);

const sw = readFileSync(join(dossier, 'sw.js'), 'utf8');
assert.match(sw, /addEventListener\('fetch'/, 'service worker sans fetch');
const precache = JSON.parse(sw.match(/const PRECACHE = (\[[\s\S]*?\n\]);/)[1]);
assert.ok(precache.length > 10, `préchargement trop mince : ${precache.length}`);
for (const url of precache) {
  assert.ok(url.startsWith(base), `préchargement hors base : ${url}`);
  assert.ok(
    existsSync(resolve(dossier, url.slice(base.length))),
    `fichier préchargé absent : ${url}`,
  );
}

for (const url of ressources) {
  assert.ok(url.startsWith(base));
  const fichier = resolve(dossier, url.slice(base.length));
  assert.ok(fichier.startsWith(dossier));
  assert.ok(existsSync(fichier), `Ressource manquante : ${url}`);
}
// Les logos réels des applications, servis et référencés.
const logos = readdirSync(join(dossier, 'logos')).filter((n) =>
  n.endsWith('.png'),
);
const accueil = sansScript(lu(''));
for (const fichier of logos)
  assert.ok(
    accueil.includes(`${base}logos/${fichier}`),
    `logo publié mais jamais affiché : ${fichier}`,
  );

// Les codes QR : un par application plus celui du portail, tous servis et
// tous affichés quelque part.
const qr = readdirSync(join(dossier, 'qr')).filter((n) => n.endsWith('.svg'));
assert.equal(qr.length, APPS.length + 1, `codes QR publiés : ${qr.length}`);
for (const id of APPS)
  assert.ok(
    sansScript(lu(`app/${id}/`)).includes(`${base}qr/${id}.svg`),
    `code QR absent de la fiche : ${id}`,
  );
assert.ok(
  sansScript(lu('')).includes(`${base}qr/portail.svg`),
  'code QR du portail absent de l’accueil',
);

// Les captures : ni orphelin publié, ni fiche qui en réclame une absente.
// Un nombre écrit en dur ici mentirait au premier changement de catalogue.
const captures = readdirSync(join(dossier, 'captures')).filter((n) =>
  n.endsWith('.jpg'),
);
const montrees = new Set();
for (const id of APPS) {
  const fiche = sansScript(lu(`app/${id}/`));
  const siennes = [...fiche.matchAll(/captures\/([\w-]+\.jpg)/g)].map((m) => m[1]);
  assert.ok(siennes.length > 0, `fiche sans capture : ${id}`);
  for (const nom of siennes) {
    assert.ok(nom.startsWith(`${id}-`), `capture d’une autre application sur ${id} : ${nom}`);
    montrees.add(nom);
  }
}
const orphelines = captures.filter((n) => !montrees.has(n));
assert.equal(orphelines.length, 0, `captures publiées mais jamais montrées : ${orphelines}`);
const manquantes = [...montrees].filter((n) => !captures.includes(n));
assert.equal(manquantes.length, 0, `captures montrées mais absentes : ${manquantes}`);
assert.ok(
  !readdirSync(dossier).some((nom) =>
    ['server', '.env', '.openai'].includes(nom),
  ),
);
console.log(
  `Export vérifié : ${PAGES.length} pages, ${APPS.length} fiches, ${SUJETS.length} sujets du wiki, ${logos.length} logos, ${qr.length} codes QR, ${captures.length} captures, ${ressources.size} ressources locales, application installable (${precache.length} fichiers hors ligne).`,
);
