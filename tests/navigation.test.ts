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
await test('en fin de page, la section qui commence à l’écran reste active', () => {
  // Page courte : le bas est atteint dès le premier saut d’ancre. La
  // dernière collection ne doit pas voler l’état actif à celle qu’on vise.
  assert.equal(
    sectionCourante(
      [
        { id: 'accueil', top: -334 },
        { id: 'prevention', top: -310 },
        { id: 'forage', top: 210 },
        { id: 'quotidien', top: 521 },
      ],
      true,
    ),
    'forage',
  );
});
await test('en fin de page, l’ancre demandée l’emporte sur l’ordre', () => {
  // Écran large : forage et vie pratique tiennent ensemble à l’image, et
  // aucune ne peut atteindre le haut. C’est le lien cliqué qui tranche.
  const positions = [
    { id: 'accueil', top: -334 },
    { id: 'prevention', top: -310 },
    { id: 'forage', top: 210 },
    { id: 'quotidien', top: 521 },
  ];
  assert.equal(sectionCourante(positions, true, 'quotidien'), 'quotidien');
  assert.equal(sectionCourante(positions, true, 'forage'), 'forage');
  // Une ancre hors écran ne vole pas l’état actif.
  assert.equal(sectionCourante(positions, true, 'prevention'), 'forage');
});
await test('une liste vide garde une destination sûre', () => {
  assert.equal(sectionCourante([], true), 'accueil');
});
