import {
  Accessibility,
  ArrowUpRight,
  AudioLines,
  BookOpen,
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
const UNE: Record<string, { eyebrow: string; title: string; text: string }> = {
  tms: {
    eyebrow: 'PRÉVENTION AU TRAVAIL',
    title: 'Les bons gestes commencent ici.',
    text: 'Découvrez Prévention des TMS.',
  },
  rodbot: {
    eyebrow: 'FORMATION OPÉRATEUR',
    title: 'Prenez en main RodBot LP.',
    text: 'Modules, quiz et simulateurs.',
  },
  bruit: {
    eyebrow: 'PROTECTION AUDITIVE',
    title: 'Mieux comprendre. Mieux se protéger.',
    text: 'Explorez la formation Bruit.',
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
      <Symbole strokeWidth={1.7} />
    </span>
  );
}

function AppCard({ application }: { application: Application }) {
  return (
    <article className="app-card">
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
          Ouvrir
          <ArrowUpRight size={15} aria-hidden="true" />
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
      <header className="header">
        <div className="header__inner">
          <a className="brand" href="#accueil" aria-label="Le Hub, accueil">
            <span className="brand__symbol">
              <Grid2X2 aria-hidden="true" size={22} />
            </span>
            <span>
              Le Hub<span className="brand__label">Applications</span>
            </span>
          </a>
          <nav aria-label="Collections">
            {COLLECTIONS.map((collection) => (
              <a key={collection.id} href={`#${collection.id}`}>
                {collection.label}
              </a>
            ))}
          </nav>
          <span className="header__signature">La collection de Frank</span>
        </div>
      </header>
      <main id="accueil" className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">DÉCOUVRIR</p>
            <h1>
              Vos applications.
              <br className="mobile-break" /> Un seul endroit.
            </h1>
          </div>
          <p className="app-count">
            <Grid2X2 size={17} aria-hidden="true" />
            {APPLICATIONS.length} applications web
          </p>
        </div>
        <section className="featured" aria-labelledby="titre-selection">
          <div className="section-heading">
            <h2 id="titre-selection">À la une</h2>
            <a href="#applications">
              Toute la collection
              <ChevronRight size={18} aria-hidden="true" />
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
                  aria-label={`${une.title} Ouvrir ${app.title} — nouvel onglet`}
                >
                  <div className="feature__copy">
                    <span className="feature__eyebrow">{une.eyebrow}</span>
                    <h3>{une.title}</h3>
                    <p>{une.text}</p>
                  </div>
                  <div className="feature__bottom">
                    <Icone id={app.id} color={app.color} large />
                    <span className="feature__action">
                      Découvrir
                      <ArrowUpRight aria-hidden="true" size={18} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
        <div id="applications" className="collections" tabIndex={-1}>
          {COLLECTIONS.map((collection) => (
            <section
              className="collection"
              id={collection.id}
              key={collection.id}
              aria-labelledby={`titre-${collection.id}`}
            >
              <div className="section-heading">
                <div>
                  <h2 id={`titre-${collection.id}`}>{collection.title}</h2>
                  <p>{collection.description}</p>
                </div>
                <span className="collection-count">
                  {applicationsCollection(collection.id).length} apps
                </span>
              </div>
              <div className="app-grid">
                {applicationsCollection(collection.id).map((application) => (
                  <AppCard key={application.id} application={application} />
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="info-note">
          <BookOpen size={22} aria-hidden="true" />
          <p>
            <strong>Ouvrez une application et retrouvez ses outils.</strong>
            <span>
              Chaque lien s’ouvre dans un nouvel onglet. Les comptes, données et
              options hors ligne restent propres à chaque application.
            </span>
          </p>
        </aside>
      </main>
      <footer className="footer">
        <a className="brand brand--footer" href="#accueil">
          <Grid2X2 size={20} aria-hidden="true" />
          Le Hub
        </a>
        <p>La collection de Frank · Applications web</p>
        <a
          href="https://github.com/Frankyray21/Portail-Applications"
          target="_blank"
          rel="noopener noreferrer"
        >
          Le projet sur GitHub
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </footer>
    </>
  );
}
