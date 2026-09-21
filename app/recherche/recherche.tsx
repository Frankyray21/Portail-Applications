'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import { APPLICATIONS, COLLECTIONS } from '@/lib/catalogue';
import { Icone } from '../icone';

const sansAccent = (texte: string) =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

// La liste complète est rendue par l'export statique : sans JavaScript, la
// page reste un catalogue consultable, seul le filtrage disparaît.
// Le champ du bandeau envoie ici avec ?q=… . L'adresse est une source
// extérieure à React : on la lit comme telle, et le rendu serveur part d'une
// chaîne vide, donc sans écart d'hydratation. Sans JavaScript, on arrive
// simplement sur la liste complète, ce qui reste utile.
const RIEN = () => () => {};
const lireRequete = () =>
  new URLSearchParams(window.location.search).get('q') ?? '';

export function Recherche() {
  const depuisAdresse = useSyncExternalStore(RIEN, lireRequete, () => '');
  // Tant que personne n'a tapé, le terme est celui de l'adresse.
  const [tape, setTape] = useState<string | null>(null);
  const terme = tape ?? depuisAdresse;
  const setTerme = setTape;

  const index = useMemo(
    () =>
      APPLICATIONS.map((app) => ({
        app,
        mots: sansAccent(
          [
            app.title,
            app.subtitle,
            app.description,
            app.resume,
            ...app.tags,
            ...app.contenu,
            COLLECTIONS.find((c) => c.id === app.collection)?.title ?? '',
          ].join(' '),
        ),
      })),
    [],
  );
  const cherche = sansAccent(terme.trim());
  const resultats = cherche
    ? index.filter((entree) => entree.mots.includes(cherche))
    : index;

  return (
    <>
      <div className="champ">
        <Search size={22} aria-hidden="true" />
        <input
          type="search"
          value={terme}
          onChange={(event) => setTerme(event.target.value)}
          placeholder="Nom, thème, contenu…"
          aria-label="Chercher une application"
          autoComplete="off"
        />
      </div>
      <p className="resultat-compte" aria-live="polite">
        {cherche
          ? `${resultats.length} résultat${resultats.length > 1 ? 's' : ''} pour « ${terme.trim()} »`
          : `${resultats.length} applications`}
      </p>
      {resultats.length === 0 ? (
        <p className="vide">
          Rien ne correspond. Essayez un thème comme « bruit », « forage » ou
          « quiz ».
        </p>
      ) : (
        <ul className="liste">
          {resultats.map(({ app }) => (
            <li key={app.id} data-app-id={app.id}>
              <Link href={`/app/${app.id}/`} className="rangee">
                <Icone id={app.id} color={app.color} />
                <span className="rangee__nom">
                  <strong>{app.title}</strong>
                  <span>{app.subtitle}</span>
                </span>
                <ChevronRight
                  size={24}
                  className="rangee__chevron"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
