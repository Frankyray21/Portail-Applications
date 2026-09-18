import {
  Accessibility,
  ArrowUpRight,
  AudioLines,
  Box,
  ClipboardList,
  Leaf,
  ShieldCheck,
  Tent,
  Wrench,
} from 'lucide-react';
import {
  APPLICATIONS,
  COLLECTIONS,
  MISE_EN_AVANT,
  applicationMiseEnAvant,
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

function Icone({ id, color }: { id: IconeId; color: string }) {
  const Symbole = ICONES[id];
  return (
    <span className={`app-icon color-${color}`} aria-hidden="true">
      <Symbole strokeWidth={1.65} />
    </span>
  );
}

// Toute la rangée ouvre l'application : le lien porte le titre, et son
// pseudo-élément couvre la fiche entière. Le sous-titre, la description et
// les thèmes restent donc lisibles par un lecteur d'écran au lieu d'être
// écrasés par un aria-label.
function AppCard({ application }: { application: Application }) {
  return (
    <article className="app-card" data-app-id={application.id}>
      <div className="app-card__top">
        <Icone id={application.id} color={application.color} />
        <div className="app-card__name">
          <h3>
            <a
              className="app-open"
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {application.title}
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </h3>
          <p>{application.subtitle}</p>
        </div>
        <ArrowUpRight className="app-card__ext" size={18} aria-hidden="true" />
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
  const miseEnAvant = applicationMiseEnAvant();
  return (
    <>
      <a href="#applications" className="skip-link">
        Aller aux applications
      </a>
      <HubShell>
        <main id="accueil" className="page" tabIndex={-1}>
          <div className="page-heading">
            <h1>La collection de Frank</h1>
            <p className="heading-description">
              Prévention, formation et outils du quotidien.
            </p>
            <p className="app-count">{APPLICATIONS.length} applications</p>
          </div>

          {miseEnAvant && MISE_EN_AVANT ? (
            <section className="highlight" aria-labelledby="titre-mise-en-avant">
              <h2 id="titre-mise-en-avant" className="sr-only">
                Mise en avant
              </h2>
              <p className="highlight__reason">{MISE_EN_AVANT.raison}</p>
              <div className="app-grid app-grid--single">
                <AppCard application={miseEnAvant} />
              </div>
            </section>
          ) : null}

          <div id="applications" className="collections" tabIndex={-1}>
            {COLLECTIONS.map((collection) => {
              const CollectionIcone = COLLECTION_ICONES[collection.id];
              const applications = applicationsCollection(collection.id);
              if (applications.length === 0) return null;
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
                      {applications.length}
                      <span className="sr-only"> applications</span>
                    </span>
                  </div>
                  <div className="app-grid">
                    {applications.map((application) => (
                      <AppCard key={application.id} application={application} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="info-note" aria-label="À propos des liens">
            <ArrowUpRight size={18} aria-hidden="true" />
            <p>
              Les applications s’ouvrent dans un nouvel onglet. Chacune conserve
              ses propres données et options hors ligne.
            </p>
          </aside>
        </main>
        <footer className="footer">
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
          <span className="footer-version">Le Hub 1.1</span>
        </footer>
      </HubShell>
    </>
  );
}
