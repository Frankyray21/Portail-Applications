import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const base = '/Portail-Applications/';
const dossier = resolve('dist/client/Portail-Applications');
const APPS = [
  'tms',
  'bruit',
  'wiki',
  'anatomie',
  'rodbot',
  'procedures',
  'camping',
  'glucides',
];
const PAGES = [
  ['', 'Aujourd’hui'],
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
  'huit rangées',
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
  assert.equal(
    new Set(ouvre.map((m) => m[1])).size,
    1,
    `la fiche ${id} ouvre plus d’une application`,
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

for (const url of ressources) {
  assert.ok(url.startsWith(base));
  const fichier = resolve(dossier, url.slice(base.length));
  assert.ok(fichier.startsWith(dossier));
  assert.ok(existsSync(fichier), `Ressource manquante : ${url}`);
}
const captures = readdirSync(join(dossier, 'captures')).filter((n) =>
  n.endsWith('.jpg'),
);
assert.equal(captures.length, 20, `captures publiées : ${captures.length}`);
assert.ok(
  !readdirSync(dossier).some((nom) =>
    ['server', '.env', '.openai'].includes(nom),
  ),
);
console.log(
  `Export vérifié : ${PAGES.length} pages, ${APPS.length} fiches, ${captures.length} captures, ${ressources.size} ressources locales.`,
);
