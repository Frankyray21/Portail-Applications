import { strict as assert } from 'node:assert';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import {
  APPLICATIONS,
  A_LA_UNE,
  COLLECTIONS,
  application,
  applicationsCollection,
  captures,
  nombre,
  pagesWiki,
  sujetsWiki,
} from '../lib/catalogue.ts';

await test('les six applications ont un identifiant unique', () => {
  assert.equal(APPLICATIONS.length, 6);
  assert.equal(new Set(APPLICATIONS.map((app) => app.id)).size, 6);
});
await test('les destinations sont des pages HTTPS publiques du propriétaire', () => {
  for (const app of APPLICATIONS) {
    const url = new URL(app.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'frankyray21.github.io');
    assert.equal(url.search, '');
    assert.equal(url.username, '');
    assert.equal(url.password, '');
    assert.notEqual(url.pathname, '/');
    const depot = new URL(app.depot);
    assert.equal(depot.protocol, 'https:');
    assert.equal(depot.hostname, 'github.com');
  }
});
await test('chaque destination publique est unique', () => {
  assert.equal(
    new Set(APPLICATIONS.map((app) => app.url)).size,
    APPLICATIONS.length,
  );
});
await test('chaque application appartient à une collection connue', () => {
  for (const app of APPLICATIONS)
    assert.ok(
      COLLECTIONS.some((collection) => collection.id === app.collection),
    );
});
await test('les collections couvrent toutes les applications sans doublon', () => {
  const ids = COLLECTIONS.flatMap((collection) =>
    applicationsCollection(collection.id).map((app) => app.id),
  );
  assert.equal(ids.length, APPLICATIONS.length);
  assert.equal(new Set(ids).size, APPLICATIONS.length);
});
await test('chaque fiche a de quoi être lue', () => {
  for (const app of APPLICATIONS) {
    assert.ok(app.title.trim() && app.subtitle.trim());
    assert.ok(app.description.trim() && app.description.length < 200);
    assert.ok(app.resume.trim().length > 60, `résumé trop court : ${app.id}`);
    assert.ok(app.contenu.length >= 3, `contenu trop mince : ${app.id}`);
    assert.ok(app.contenu.every((ligne) => ligne.trim().length > 0));
    assert.ok(app.tags.length > 0);
  }
});
await test('chaque capture annoncée existe vraiment', () => {
  for (const app of APPLICATIONS) {
    assert.ok(app.captures >= 1, `aucune capture : ${app.id}`);
    for (const image of captures(app))
      assert.ok(
        existsSync(new URL(`../public${image}`, import.meta.url)),
        `capture manquante : ${image}`,
      );
  }
});
await test('la mise en avant ne cite que des applications réelles et motivées', () => {
  assert.equal(new Set(A_LA_UNE.map((une) => une.id)).size, A_LA_UNE.length);
  for (const une of A_LA_UNE) {
    assert.ok(application(une.id), `application inconnue : ${une.id}`);
    assert.ok(une.raison.trim().length > 10, `raison trop mince : ${une.id}`);
  }
});
await test('aucune note, aucun avis, aucun compteur inventé', () => {
  // Le portail ne fabrique pas de popularité : ces mots ne doivent pas
  // apparaître dans les textes du catalogue.
  const interdits =
    /\b(étoiles?|note de|notée?|avis|téléchargements?|classement|top \d|\d+ ?★)\b/i;
  for (const app of APPLICATIONS) {
    const textes = [app.resume, app.description, ...app.contenu].join(' ');
    assert.doesNotMatch(textes, interdits, `mention inventée : ${app.id}`);
  }
  for (const une of A_LA_UNE) assert.doesNotMatch(une.raison, interdits);
});
await test('les sujets du wiki mènent tous dans le wiki', () => {
  const sujets = sujetsWiki();
  assert.equal(sujets.length, 7);
  assert.equal(new Set(sujets.map((sujet) => sujet.id)).size, sujets.length);
  const wiki = application('wiki');
  assert.ok(wiki);
  for (const sujet of sujets) {
    assert.ok(sujet.titre.trim(), `titre vide : ${sujet.id}`);
    assert.ok(sujet.exemples.trim().length > 15, `exemples minces : ${sujet.id}`);
    assert.ok(
      Number.isInteger(sujet.articles) && sujet.articles > 0,
      `compte d’articles invalide : ${sujet.id}`,
    );
    const url = new URL(sujet.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'frankyray21.github.io');
    assert.ok(
      sujet.url.startsWith(wiki.url),
      `le sujet sort du wiki : ${sujet.url}`,
    );
  }
});
await test('le total des sujets est celui qu’annonce le wiki', () => {
  // Le portail du wiki affiche 3 940 pages ; nos sept disciplines doivent
  // retomber sur ce total, sinon l'une d'elles a bougé.
  assert.equal(pagesWiki(), 3940);
});
await test('les nombres sont écrits avec une espace insécable', () => {
  assert.equal(nombre(3940), '3\u00a0940');
  assert.equal(nombre(320), '320');
  assert.equal(nombre(3327), '3\u00a0327');
});
await test('application() retrouve une fiche et ignore un identifiant inconnu', () => {
  assert.equal(application('rodbot')?.title, 'RodBot LP');
  assert.equal(application('inexistant'), undefined);
});
