import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  APPLICATIONS,
  COLLECTIONS,
  applicationsCollection,
} from '@/lib/catalogue';
import { StoreShell } from '../store-shell';
import { Icone } from '../icone';

export const metadata = {
  title: 'Applications — Le Hub',
  description: 'Les huit applications de la collection, par collection.',
};

export default function Applications() {
  return (
    <StoreShell actif="applications">
      <main id="contenu" className="page" tabIndex={-1}>
        <header className="entete">
          <p className="entete__sur">{APPLICATIONS.length} applications</p>
          <h1>Applications</h1>
        </header>

        {COLLECTIONS.map((collection) => (
          <section
            key={collection.id}
            id={collection.id}
            className="groupe"
            aria-labelledby={`titre-${collection.id}`}
            tabIndex={-1}
          >
            <div className="groupe__tete">
              <h2 id={`titre-${collection.id}`}>{collection.title}</h2>
              <p>{collection.description}</p>
            </div>
            <ul className="liste">
              {applicationsCollection(collection.id).map((app) => (
                <li key={app.id} data-app-id={app.id}>
                  <Link href={`/app/${app.id}/`} className="rangee">
                    <Icone id={app.id} color={app.color} />
                    <span className="rangee__nom">
                      <strong>{app.title}</strong>
                      <span>{app.subtitle}</span>
                    </span>
                    <span className="rangee__voir">
                      Voir
                      <ChevronRight size={16} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </StoreShell>
  );
}
