import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  APPLICATIONS,
  COLLECTIONS,
  application,
  applicationsCollection,
  captures,
  logo,
  nombre,
  pagesWiki,
  sujetsWiki,
} from '../lib/catalogue.ts';

await test('les cinq applications ont un identifiant unique', () => {
  assert.equal(APPLICATIONS.length, 5);
  assert.equal(new Set(APPLICATIONS.map((app) => app.id)).size, 5);
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
await test('chaque logo annoncé existe vraiment', () => {
  for (const app of APPLICATIONS) {
    const chemin = logo(app);
    if (app.logo) {
      assert.ok(chemin, `logo annoncé mais introuvable : ${app.id}`);
      assert.ok(
        existsSync(new URL(`../public${chemin}`, import.meta.url)),
        `fichier de logo manquant : ${chemin}`,
      );
    } else {
      assert.equal(chemin, null);
    }
  }
});
await test('chaque code QR mène là où mène le bouton Ouvrir', async () => {
  // On régénère le code avec les mêmes options et on compare au fichier
  // publié : si une adresse du catalogue change sans que les codes soient
  // refaits, ce test échoue au lieu de laisser un code mentir au mur.
  const QRCode = (await import('qrcode')).default;
  const { URL_PUBLIQUE } = await import('../lib/base.ts');
  // Les options viennent du générateur lui-même : une seule source.
  const { OPTIONS } = await import('../scripts/build-qr.mjs');
  const codes: [string, string][] = [
    ['portail', URL_PUBLIQUE],
    ...APPLICATIONS.map((app): [string, string] => [app.id, app.url]),
  ];
  for (const [nom, cible] of codes) {
    const fichier = new URL(`../public/qr/${nom}.svg`, import.meta.url);
    assert.ok(existsSync(fichier), `code QR manquant : ${nom}`);
    assert.equal(
      readFileSync(fichier, 'utf8'),
      await QRCode.toString(cible, OPTIONS),
      `le code QR de ${nom} ne mène plus à ${cible}`,
    );
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
await test('le manifeste parle du même chemin de base que le code', async () => {
  const { BASE_PATH } = await import('../lib/base.ts');
  const manifeste = JSON.parse(
    readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'),
  );
  const base = `${BASE_PATH}/`;
  for (const chemin of [
    manifeste.start_url,
    manifeste.scope,
    manifeste.id,
    ...manifeste.icons.map((icone: { src: string }) => icone.src),
  ])
    assert.ok(chemin.startsWith(base), `manifeste hors base : ${chemin}`);
  assert.equal(manifeste.display, 'standalone');
  assert.equal(manifeste.lang, 'fr-CA');
  for (const icone of manifeste.icons)
    assert.ok(
      existsSync(new URL(`../public${icone.src.slice(BASE_PATH.length)}`, import.meta.url)),
      `icône manquante : ${icone.src}`,
    );
});
await test('application() retrouve une fiche et ignore un identifiant inconnu', () => {
  assert.equal(application('rodbot')?.title, 'RodBot LP');
  assert.equal(application('inexistant'), undefined);
});
