import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ChevronLeft, Code2 } from 'lucide-react';
import { ressource } from '@/lib/base';
import { APPLICATIONS, application, captures } from '@/lib/catalogue';
import { StoreShell } from '../../store-shell';
import { Icone } from '../../icone';

export function generateStaticParams() {
  return APPLICATIONS.map((app) => ({ id: app.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const app = application((await params).id);
  if (!app) return { title: 'Application introuvable — Le Hub' };
  return { title: `${app.title} — Le Hub`, description: app.description };
}

export default async function Fiche({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const app = application((await params).id);
  if (!app) notFound();
  const images = captures(app);
  return (
    <StoreShell actif="applications">
      <main id="contenu" className="page fiche" tabIndex={-1}>
        <Link href="/applications/" className="retour">
          <ChevronLeft size={18} aria-hidden="true" />
          Applications
        </Link>

        <header className="fiche__tete">
          <Icone id={app.id} color={app.color} taille="grande" />
          <div className="fiche__nom">
            <h1>{app.title}</h1>
            <p>{app.subtitle}</p>
          </div>
          <a
            className="ouvrir"
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ouvrir
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </header>
        <p className="fiche__nouvel-onglet">
          S’ouvre dans un nouvel onglet, sur {new URL(app.url).hostname}.
        </p>

        <section className="captures" aria-labelledby="titre-captures">
          <h2 id="titre-captures" className="sr-only">
            Aperçu
          </h2>
          {/* Une grille plutôt qu'un carrousel : au plus trois captures, donc
              rien à faire défiler, rien à masquer, et aucun conteneur
              défilant à rendre atteignable au clavier. */}
          <ul>
            {images.map((image, index) => (
              <li key={image}>
                <img
                  src={ressource(image)}
                  alt={`${app.title}, aperçu ${index + 1} sur ${images.length}`}
                  width={585}
                  height={1266}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="bloc" aria-labelledby="titre-resume">
          <h2 id="titre-resume">Présentation</h2>
          <p className="fiche__resume">{app.resume}</p>
        </section>

        <section className="bloc" aria-labelledby="titre-contenu">
          <h2 id="titre-contenu">Ce que ça contient</h2>
          <ul className="contenu">
            {app.contenu.map((ligne) => (
              <li key={ligne}>{ligne}</li>
            ))}
          </ul>
        </section>

        <section className="bloc" aria-labelledby="titre-liens">
          <h2 id="titre-liens">Liens</h2>
          <ul className="liens">
            <li>
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight size={17} aria-hidden="true" />
                Ouvrir {app.title}
              </a>
            </li>
            <li>
              <a href={app.depot} target="_blank" rel="noopener noreferrer">
                <Code2 size={17} aria-hidden="true" />
                Le code source sur GitHub
              </a>
            </li>
          </ul>
          <ul className="themes" aria-label="Thèmes">
            {app.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </section>
      </main>
    </StoreShell>
  );
}
