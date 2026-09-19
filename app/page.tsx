import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { ressource } from '@/lib/base';
import {
  APPLICATIONS,
  A_LA_UNE,
  VERIFICATION_LIENS,
  application,
  captures,
  nombre,
  pagesWiki,
  sujetsWiki,
} from '@/lib/catalogue';
import { StoreShell } from './store-shell';
import { Icone } from './icone';

export const metadata = {
  title: 'Aujourd’hui — Le Hub',
  description:
    'La collection de Frank : prévention, formation et forage en mine.',
};

// Le lanceur d'abord, la vitrine ensuite : l'habitué trouve sa plaque au
// premier écran, le visiteur lit ce qu'est la collection puis voit de
// vraies captures.
export default function Aujourdhui() {
  return (
    <StoreShell actif="aujourdhui">
      <main id="contenu" className="page" tabIndex={-1}>
        <header className="entete">
          <h1>Aujourd’hui</h1>
          <p className="entete__lede">
            Six applications construites par Frank pour la prévention, la
            formation et le forage en mine. Chaque fiche dit ce que
            l’application contient, puis l’ouvre.
          </p>
        </header>

        <section className="bande" aria-labelledby="titre-tout">
          <h2 id="titre-tout">Les six applications</h2>
          <ul className="pastilles">
            {APPLICATIONS.map((app) => (
              <li key={app.id}>
                <Link href={`/app/${app.id}/`}>
                  <Icone id={app.id} color={app.color} />
                  <span>{app.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="bande__suite">
            <Link href="/applications/" className="lien-cuivre">
              Voir par collection
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </p>
        </section>

        <section className="une" aria-labelledby="titre-une">
          <h2 id="titre-une">À la une</h2>
          <ul className="une__liste">
            {A_LA_UNE.map(({ id, raison }) => {
              const app = application(id)!;
              const [image] = captures(app);
              return (
                <li key={id}>
                  <Link href={`/app/${app.id}/`} className="carte-une">
                    <img
                      className="carte-une__apercu"
                      src={ressource(image)}
                      alt=""
                      width={585}
                      height={1266}
                      loading="lazy"
                    />
                    <div className="carte-une__texte">
                      <h3>{app.title}</h3>
                      <span className="carte-une__sous">{app.subtitle}</span>
                      <span className="carte-une__raison">{raison}</span>
                      <span className="carte-une__voir">
                        Voir la fiche
                        <ChevronRight size={18} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="fonds" aria-labelledby="titre-fonds">
          <h2 id="titre-fonds">Le fond documentaire</h2>
          <p className="fonds__lede">
            Le WIKI SST — Mines réunit {nombre(pagesWiki())} pages en sept
            disciplines. Chaque sujet s’ouvre droit dans le wiki, ou{' '}
            <Link href="/app/wiki/" className="lien-cuivre">
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

        <aside className="mention" aria-label="À propos de cette collection">
          <p>
            Six outils personnels, construits par Frank pour son travail. Ils
            ne remplacent ni les procédures officielles de votre employeur, ni
            un avis professionnel.
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
