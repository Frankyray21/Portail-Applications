import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight, LayoutGrid, Search, Sparkles } from 'lucide-react';
import { APPLICATIONS } from '@/lib/catalogue';

export type Onglet = 'aujourdhui' | 'applications' | 'recherche';

const ONGLETS = [
  { id: 'aujourdhui', label: 'Aujourd’hui', href: '/', icon: Sparkles },
  {
    id: 'applications',
    label: 'Applications',
    href: '/applications/',
    icon: LayoutGrid,
  },
  { id: 'recherche', label: 'Rechercher', href: '/recherche/', icon: Search },
] as const;

const DEPOT_PORTAIL = 'https://github.com/Frankyray21/Portail-Applications';

// La marque : quatre plaques, dont une en cuivre — celle qu'on choisit.
// C'est aussi le dessin du favicon.
function Marque() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="13" y="2" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="2" y="13" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect
        x="13"
        y="13"
        width="9"
        height="9"
        rx="1.5"
        className="marque__cuivre"
      />
    </svg>
  );
}

// Coquille de la boutique : un bandeau pétrole avec la marque et, sur
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
          <Link href="/" className="marque" aria-label="Le Hub, accueil">
            <Marque />
            <span>
              <span className="marque__nom">Le Hub</span>
              <span className="marque__sous">La collection de Frank</span>
            </span>
          </Link>
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
        </div>
      </header>

      <div className="vue">
        {children}
        <footer className="pied">
          <p>
            Le Hub 1.3 · {APPLICATIONS.length} applications, construites par
            Frank.{' '}
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
