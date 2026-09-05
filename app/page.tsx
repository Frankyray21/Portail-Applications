import {
  Accessibility,
  ArrowUpRight,
  AudioLines,
  Box,
  ChevronRight,
  ClipboardList,
  Grid2X2,
  Leaf,
  ShieldCheck,
  Tent,
  Wrench,
} from 'lucide-react';
import {
  APPLICATIONS,
  COLLECTIONS,
  SELECTION,
  applicationsCollection,
  type Application,
  type IconeId,
} from '@/lib/catalogue';
import { HubShell } from './hub-shell';

const ICONES = {
  tms: Accessibility,
  bruit: AudioLines,
  rodbot: Wrench,
  procedures: ClipboardList,
  wiki: ShieldCheck,
  anatomie: Box,
  camping: Tent,
  glucides: Leaf,
};
const COLLECTION_ICONES = {
  prevention: ShieldCheck,
  forage: Wrench,
  quotidien: Leaf,
};
const UNE: Record<string, { eyebrow: string; text: string }> = {
  tms: {
    eyebrow: 'ERGONOMIE AU TRAVAIL',
    text: 'Comprendre les risques. Adopter les bons réflexes.',
  },
  rodbot: {
    eyebrow: 'FORMATION OPÉRATEUR',
    text: 'Modules, quiz et simulateurs.',
  },
  bruit: {
    eyebrow: 'PROTECTION AUDITIVE',
    text: 'Formation et calculateurs d’exposition.',
  },
};

function Icone({
  id,
  color,
  large = false,
}: {
  id: IconeId;
  color: string;
  large?: boolean;
}) {
  const Symbole = ICONES[id];
  return (
    <span
      className={`app-icon color-${color}${large ? ' app-icon--large' : ''}`}
      aria-hidden="true"
    >
      <Symbole strokeWidth={1.65} />
    </span>
  );
}

function AppCard({ application }: { application: Application }) {
  return (
    <article className="app-card" data-app-id={application.id}>
      <div className="app-card__top">
        <Icone id={application.id} color={application.color} />
        <div className="app-card__name">
          <h3>{application.title}</h3>
          <p>{application.subtitle}</p>
        </div>
        <a
          className="open-button"
          href={application.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ouvrir ${application.title} — nouvel onglet`}
        >
          Ouvrir <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <p className="app-description">{application.description}</p>
      <ul className="app-tags" aria-label="Thèmes">
        {application.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <a href="#applications" className="skip-link">
        Aller aux applications
      </a>
      <HubShell>
        <main id="accueil" className="page" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <p className="eyebrow">VOTRE ESPACE D’APPLICATIONS</p>
              <h1>Découvrir</h1>
              <p className="heading-description">
                Prévention, formation et outils du quotidien.
              </p>
            </div>
            <a className="app-count" href="#applications">
              <Grid2X2 size={18} aria-hidden="true" />
              {APPLICATIONS.length} applications
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>

          <section className="featured" aria-labelledby="titre-selection">
            <div className="section-heading">
              <h2 id="titre-selection">À la une</h2>
              <a href="#applications">
                Tout voir <ChevronRight size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="featured-grid">
              {SELECTION.map((id) => {
                const app = APPLICATIONS.find(
                  (application) => application.id === id,
                )!;
                const une = UNE[id]!;
                return (
                  <a
                    key={id}
                    className={`feature feature--${app.color}`}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir ${app.title} — nouvel onglet`}
                  >
                    <div className="feature__copy">
                      <span className="feature__eyebrow">{une.eyebrow}</span>
                      <h3>{app.title}</h3>
                      <p>{une.text}</p>
                    </div>
                    <Icone id={app.id} color={app.color} large />
                    <div className="feature__bottom">
                      <span className="feature__themes">
                        {app.tags.join(' · ')}
                      </span>
                      <span className="feature__action">
                        Ouvrir <ArrowUpRight aria-hidden="true" size={17} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <div id="applications" className="collections" tabIndex={-1}>
            {COLLECTIONS.map((collection) => {
              const CollectionIcone = COLLECTION_ICONES[collection.id];
              return (
                <section
                  className="collection"
                  id={collection.id}
                  key={collection.id}
                  aria-labelledby={`titre-${collection.id}`}
                  tabIndex={-1}
                >
                  <div className="section-heading collection-heading">
                    <span
                      className={`collection-icon collection-icon--${collection.id}`}
                      aria-hidden="true"
                    >
                      <CollectionIcone size={21} strokeWidth={1.8} />
                    </span>
                    <div className="collection-heading__copy">
                      <h2 id={`titre-${collection.id}`}>{collection.title}</h2>
                      <p>{collection.description}</p>
                    </div>
                    <span className="collection-count">
                      {applicationsCollection(collection.id).length}
                      <span className="sr-only"> applications</span>
                    </span>
                  </div>
                  <div className="app-grid">
                    {applicationsCollection(collection.id).map(
                      (application) => (
                        <AppCard
                          key={application.id}
                          application={application}
                        />
                      ),
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="info-note">
            <ArrowUpRight size={18} aria-hidden="true" />
            <p>
              Les applications s’ouvrent dans un nouvel onglet. Chacune conserve
              ses propres données et options hors ligne.
            </p>
          </aside>
        </main>
        <footer className="footer">
          <span className="footer-brand">
            <Grid2X2 size={17} aria-hidden="true" /> Le Hub <span>1.1</span>
          </span>
          <p>La collection de Frank</p>
          <a
            className="footer-source"
            href="https://github.com/Frankyray21/Portail-Applications"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Le projet sur GitHub — nouvel onglet"
          >
            GitHub <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="#accueil">
            Retour en haut{' '}
            <ChevronRight
              className="back-top-icon"
              size={16}
              aria-hidden="true"
            />
          </a>
        </footer>
      </HubShell>
    </>
  );
}
