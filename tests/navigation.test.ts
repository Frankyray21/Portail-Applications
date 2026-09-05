import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { sectionCourante } from '../lib/navigation.ts';

await test('la découverte reste active avant la première collection', () => {
  assert.equal(
    sectionCourante([
      { id: 'accueil', top: 70 },
      { id: 'prevention', top: 500 },
    ]),
    'accueil',
  );
});
await test('la section visible prend le relais au défilement', () => {
  assert.equal(
    sectionCourante([
      { id: 'accueil', top: -900 },
      { id: 'prevention', top: -300 },
      { id: 'forage', top: 120 },
      { id: 'quotidien', top: 500 },
    ]),
    'forage',
  );
});
await test('la dernière collection est active en fin de page même si elle est courte', () => {
  assert.equal(
    sectionCourante(
      [
        { id: 'forage', top: -400 },
        { id: 'quotidien', top: 260 },
      ],
      true,
    ),
    'quotidien',
  );
});
await test('une liste vide garde une destination sûre', () => {
  assert.equal(sectionCourante([], true), 'accueil');
});
