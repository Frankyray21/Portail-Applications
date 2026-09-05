import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  APPLICATIONS,
  COLLECTIONS,
  SELECTION,
  applicationsCollection,
} from '../lib/catalogue.ts';

await test('les huit applications ont un identifiant unique', () => {
  assert.equal(APPLICATIONS.length, 8);
  assert.equal(new Set(APPLICATIONS.map((app) => app.id)).size, 8);
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
  }
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
  assert.ok(
    COLLECTIONS.every(
      (collection) => applicationsCollection(collection.id).length > 0,
    ),
  );
});
await test('la sélection à la une ne référence que des applications existantes', () => {
  assert.equal(SELECTION.length, 3);
  assert.equal(new Set(SELECTION).size, SELECTION.length);
  for (const id of SELECTION)
    assert.ok(APPLICATIONS.some((app) => app.id === id));
});
await test('les fiches ont des descriptions et thèmes non vides', () => {
  for (const app of APPLICATIONS) {
    assert.ok(
      app.title.trim() && app.subtitle.trim() && app.description.trim(),
    );
    assert.ok(app.tags.length > 0);
    assert.ok(app.description.length < 200);
  }
});
await test('chaque destination publique est unique', () => {
  assert.equal(
    new Set(APPLICATIONS.map((app) => app.url)).size,
    APPLICATIONS.length,
  );
});
await test('les procédures de forage MRI sont accessibles dans leur collection', () => {
  const procedures = applicationsCollection('forage').find(
    (app) => app.id === 'procedures',
  );
  assert.ok(procedures);
  assert.equal(procedures.title, 'Procédures de forage');
  assert.equal(
    procedures.url,
    'https://frankyray21.github.io/Procedures-Forage-MRI/',
  );
  const collection = COLLECTIONS.find((item) => item.id === 'forage');
  assert.match(collection?.label ?? '', /procédures/i);
});
