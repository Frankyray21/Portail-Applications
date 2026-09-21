import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight, House, LayoutGrid, Search } from 'lucide-react';
import { ressource } from '@/lib/base';
import { APPLICATIONS } from '@/lib/catalogue';
import { ServiceWorker } from './installer';
import { Theme } from './theme';

export type Onglet = 'decouvrir' | 'applications' | 'recherche';

// « Rechercher » n'est pas un onglet : le champ du bandeau est sur toutes
// les pages, un onglet de plus ne ferait que répéter le même geste et
// prendre la place dont le champ a besoin pour montrer son invite.

const ONGLETS = [
  { id: 'decouvrir', label: 'Découvrir', href: '/', icon: House },
  {
    id: 'applications',
    label: 'Applications',
    href: '/applications/',
    icon: LayoutGrid,
  },
] as const;

const DEPOT_PORTAIL = 'https://github.com/Frankyray21/Portail-Applications';

// La marque : la grappe de quatre tuiles du logo, découpée par
// scripts/build-icones.mjs. Le mot-symbole du logo n'est pas repris ici — il
// serait illisible à cette taille, et le nom est écrit juste à côté.
function Marque() {
  return (
    <img
      src={ressource('/marque.png')}
      alt=""
      width={224}
      height={224}
      decoding="async"
    />
  );
}

// Coquille de la boutique : un bandeau noir avec la marque et, sur
// ordinateur, les trois onglets ; sur téléphone, les onglets passent dans
// une barre fixée au bas de l'écran, sous le pouce. Les deux navigations
// sont rendues par l'export : la feuille de style choisit laquelle montrer.
export function StoreShell({
  actif,
  children,
}: {
  actif: Onglet;
  children: ReactNode;
}) {
  return (
    <div className="store">
      <header className="bandeau">
        <div className="bandeau__dedans">
          <Link href="/" className="marque" aria-label="Portail SST MRI, accueil">
            <Marque />
            <span>
              <span className="marque__nom">Portail SST — MRI</span>
              <span className="marque__sous">Machines Roger International</span>
            </span>
          </Link>
          <search className="chercher">
            <form action={ressource('/recherche/')}>
              <Search size={19} aria-hidden="true" />
              <input
                type="search"
                name="q"
                placeholder="Rechercher une application, un sujet…"
                aria-label="Rechercher une application ou un sujet"
                autoComplete="off"
              />
            </form>
          </search>
          <nav className="onglets-haut" aria-label="Navigation principale">
            <ul>
              {ONGLETS.map(({ id, label, href, icon: Icon }) => (
                <li key={id}>
                  <Link
                    href={href}
                    className="onglet"
                    aria-current={actif === id ? 'page' : undefined}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Theme />
        </div>
      </header>

      <div className="vue">
        {children}
        <footer className="pied">
          <ServiceWorker />
          <p>
            Portail SST 1.15 · {APPLICATIONS.length} applications.{' '}
            <a href={DEPOT_PORTAIL} target="_blank" rel="noopener noreferrer">
              Le code source du portail
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </p>
        </footer>
      </div>

      <nav className="onglets" aria-label="Navigation">
        {ONGLETS.map(({ id, label, href, icon: Icon }) => (
          <Link
            key={id}
            href={href}
            aria-current={actif === id ? 'page' : undefined}
          >
            <Icon size={24} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
