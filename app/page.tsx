import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { URL_PUBLIQUE, ressource } from '@/lib/base';
import {
  APPLICATIONS,
  A_LA_UNE,
  COLLECTIONS,
  VERIFICATION_LIENS,
  application,
  captures,
  nombre,
  pagesWiki,
  sujetsWiki,
} from '@/lib/catalogue';
import { Emporter } from './emporter';
import { Icone } from './icone';
import { StoreShell } from './store-shell';

export const metadata = {
  title: 'Découvrir · Portail SST — MRI',
  description:
    'Les applications santé et sécurité de Machines Roger International : prévention, formation et forage en mine.',
};

const collection = (id: string) =>
  COLLECTIONS.find((c) => c.id === id)?.label ?? '';

// Deux gestes, jamais mélangés : le nom mène à la fiche (ce que contient
// l'application), le bouton ouvre l'application. Aucun lien dans un lien.
export default function Decouvrir() {
  return (
    <StoreShell actif="decouvrir">
      <main id="contenu" className="page" tabIndex={-1}>
        <header className="entete">
          <h1>Découvrir</h1>
          <p className="entete__lede">
            Des outils pour un milieu de travail plus sûr. Le bouton ouvre
            l’application : déjà posée sur l’écran d’accueil, elle s’ouvre
            telle quelle ; sinon, ajoutez-la de là, et elle s’ouvrira ensuite
            sans réseau, sous terre.
          </p>
        </header>

        <section className="une" aria-labelledby="titre-une">
          <h2 id="titre-une" className="sr-only">
            À la une
          </h2>
          <ul className="une__liste">
            {A_LA_UNE.map(({ id, raison }, rang) => {
              const app = application(id)!;
              const [image] = captures(app);
              return (
                <li key={id} className="heros">
                  <p className="heros__genre">
                    {rang === 0 ? 'À la une' : collection(app.collection)}
                  </p>
                  <h3 className="heros__nom">
                    <Link href={`/app/${app.id}/`}>{app.title}</Link>
                  </h3>
                  <p className="heros__sous">{app.subtitle}</p>
                  <p className="heros__raison">{raison}</p>
                  <p className="heros__action">
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bouton-clair"
                    >
                      Ouvrir
                      <ArrowUpRight size={17} aria-hidden="true" />
                      <span className="sr-only">
                        {` ${app.title} (nouvel onglet)`}
                      </span>
                    </a>
                  </p>
                  <img
                    className="heros__apercu"
                    src={ressource(image)}
                    alt=""
                    width={585}
                    height={1266}
                    loading="lazy"
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <section className="essentiels" aria-labelledby="titre-essentiels">
          <div className="essentiels__tete">
            <h2 id="titre-essentiels">Les essentiels</h2>
            <Link href="/applications/" className="lien-rouge">
              Voir par collection
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <ul className="essentiels__liste">
            {APPLICATIONS.map((app) => (
              <li key={app.id} className="tuile" data-app-id={app.id}>
                <Icone id={app.id} color={app.color} />
                <h3 className="tuile__nom">
                  <Link href={`/app/${app.id}/`}>{app.title}</Link>
                </h3>
                <p className="tuile__genre">{app.subtitle}</p>
                <p className="tuile__quoi">{app.description}</p>
                <p className="tuile__action">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bouton-rouge"
                  >
                    Ouvrir
                    <ArrowUpRight size={16} aria-hidden="true" />
                    <span className="sr-only">
                      {` ${app.title} (nouvel onglet)`}
                    </span>
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="fonds" aria-labelledby="titre-fonds">
          <h2 id="titre-fonds">Le fond documentaire</h2>
          <p className="fonds__lede">
            Le WIKI SST — Mines réunit {nombre(pagesWiki())} pages en sept
            disciplines. Chaque sujet s’ouvre droit dans le wiki, ou{' '}
            <Link href="/app/wiki/" className="lien-rouge">
              voyez d’abord sa fiche
            </Link>
            .
          </p>
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

        <Emporter />

        <section className="afficher" aria-labelledby="titre-afficher">
          <h2 id="titre-afficher">Afficher le portail</h2>
          <div className="qr">
            <img
              src={ressource('/qr/portail.svg')}
              alt=""
              width={200}
              height={200}
            />
            <p>
              À imprimer et à poser au mur, dans la salle à dîner ou près de
              la machine. Le code ouvre cette page.
              <span className="qr__adresse">{URL_PUBLIQUE}</span>
            </p>
          </div>
        </section>

        <aside className="mention" aria-label="À propos de ce portail">
          <p>
            Cinq outils de travail, réunis ici pour les retrouver vite. Ils ne
            remplacent ni les procédures officielles de votre employeur, ni un
            avis professionnel.
          </p>
          <p>
            Aucune note, aucun avis, aucun compteur de téléchargement : rien de
            tout cela n’existe ici. Adresses vérifiées le {VERIFICATION_LIENS}.
          </p>
        </aside>
      </main>
    </StoreShell>
  );
}
