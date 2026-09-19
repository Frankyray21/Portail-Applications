import Link from 'next/link';
import type { ReactNode } from 'react';
import { LayoutGrid, Search, Sparkles } from 'lucide-react';
import { APPLICATIONS, COLLECTIONS, applicationsCollection } from '@/lib/catalogue';

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

export function StoreShell({
  actif,
  children,
}: {
  actif: Onglet;
  children: ReactNode;
}) {
  return (
    <div className="store">
      <aside className="rail" aria-label="Le Hub">
        <div className="rail__brand">
          <Link href="/" aria-label="Le Hub, accueil">
            Le Hub
            <span>La collection de Frank</span>
          </Link>
        </div>
        <nav className="rail__nav" aria-label="Navigation principale">
          <ul>
            {ONGLETS.map(({ id, label, href, icon: Icon }) => (
              <li key={id}>
                <Link
                  href={href}
                  className="rail__lien"
                  aria-current={actif === id ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="rail__titre">Collections</p>
          <ul>
            {COLLECTIONS.map((collection) => (
              <li key={collection.id}>
                <Link
                  href={`/applications/#${collection.id}`}
                  className="rail__lien rail__lien--mineur"
                >
                  <span>{collection.label}</span>
                  <span className="rail__compte">
                    {applicationsCollection(collection.id).length}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="rail__pied">
          {APPLICATIONS.length} applications · Le Hub 1.2
        </p>
      </aside>

      <div className="vue">{children}</div>

      <nav className="onglets" aria-label="Navigation">
        {ONGLETS.map(({ id, label, href, icon: Icon }) => (
          <Link
            key={id}
            href={href}
            aria-current={actif === id ? 'page' : undefined}
          >
            <Icon size={22} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
