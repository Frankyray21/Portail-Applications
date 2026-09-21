import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ChevronLeft, Code2 } from 'lucide-react';
import { ressource } from '@/lib/base';
import {
  APPLICATIONS,
  application,
  captures,
  nombre,
  sujetsWiki,
} from '@/lib/catalogue';
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
          <ChevronLeft size={20} aria-hidden="true" />
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
            <ArrowUpRight size={20} aria-hidden="true" />
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

        {app.id === 'wiki' ? (
          <section className="bloc" aria-labelledby="titre-sujets">
            <h2 id="titre-sujets">Les sujets</h2>
            <ul className="sujets">
              {sujetsWiki().map((sujet) => (
                <li key={sujet.id}>
                  <a href={sujet.url} target="_blank" rel="noopener noreferrer">
                    <span className="sujets__titre">
                      {sujet.titre}
                      <span className="sr-only"> (nouvel onglet)</span>
                    </span>
                    <span className="sujets__exemples">{sujet.exemples}</span>
                    <span className="sujets__compte">
                      {nombre(sujet.articles)} articles
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="bloc" aria-labelledby="titre-qr">
          <h2 id="titre-qr">Scanner pour ouvrir</h2>
          <div className="qr">
            {/* Le code mène à la même adresse que le bouton « Ouvrir ».
                Décoratif : l'adresse est écrite juste à côté, ce qu'un
                lecteur d'écran peut restituer, contrairement au code. */}
            <img
              src={ressource(`/qr/${app.id}.svg`)}
              alt=""
              width={200}
              height={200}
            />
            <p>
              Montrez ce code à quelqu’un : son téléphone ouvre{' '}
              {app.title} directement.
              <span className="qr__adresse">{app.url}</span>
            </p>
          </div>
        </section>

        <section className="bloc" aria-labelledby="titre-liens">
          <h2 id="titre-liens">Liens</h2>
          <ul className="liens">
            <li>
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight size={19} aria-hidden="true" />
                Ouvrir {app.title}
              </a>
            </li>
            <li>
              <a href={app.depot} target="_blank" rel="noopener noreferrer">
                <Code2 size={19} aria-hidden="true" />
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
