import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const base = '/Portail-Applications/';
const dossier = resolve('dist/client/Portail-Applications');
const html = readFileSync(join(dossier, 'index.html'), 'utf8');
const page = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
assert.ok(page.includes('<html lang="fr-CA">'));
assert.ok(page.includes('<title>Le Hub — Applications</title>'));
assert.equal((page.match(/<h1\b/g) ?? []).length, 1);
assert.equal((page.match(/class="app-card"/g) ?? []).length, 8);
assert.equal((page.match(/class="feature feature--/g) ?? []).length, 3);
for (const id of [
  'accueil',
  'applications',
  'prevention',
  'forage',
  'quotidien',
]) {
  assert.ok(page.includes(`id="${id}"`), `Ancre manquante : ${id}`);
}
const ressources = [
  ...html.matchAll(/(?:src|href)="(\/Portail-Applications\/[^"#?]+)"/g),
].map((match) => match[1]);
assert.ok(ressources.length > 0);
for (const url of ressources) {
  assert.ok(url.startsWith(base));
  const fichier = resolve(dossier, url.slice(base.length));
  assert.ok(fichier.startsWith(dossier));
  assert.ok(existsSync(fichier), `Ressource manquante : ${url}`);
}
assert.ok(
  !page.includes('Untitled site') &&
    !page.includes('Your site is taking shape'),
);
assert.ok(!html.includes('sites.test') && !html.includes('localhost:'));
assert.ok(!/<(?:script|iframe)[^>]+src="https?:/i.test(html));
for (const match of page.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)) {
  assert.ok(match[1].includes('rel="noopener noreferrer"'));
}
// L'artefact Pages est seulement le sous-dossier public, sans code serveur.
assert.ok(
  !readdirSync(dossier).some((nom) =>
    ['server', '.env', '.openai'].includes(nom),
  ),
);
console.log(
  `Export vérifié : 8 applications, 3 collections, 3 sélections, ${new Set(ressources).size} ressources locales.`,
);
