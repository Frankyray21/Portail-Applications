import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ressource } from '@/lib/base';
import {
  APPLICATIONS,
  A_LA_UNE,
  VERIFICATION_LIENS,
  application,
  captures,
} from '@/lib/catalogue';
import { StoreShell } from './store-shell';
import { Icone } from './icone';

export const metadata = {
  title: 'Aujourd’hui — Le Hub',
  description:
    'La collection de Frank : prévention, formation et outils du quotidien.',
};

export default function Aujourdhui() {
  return (
    <StoreShell actif="aujourdhui">
      <main id="contenu" className="page" tabIndex={-1}>
        <header className="entete">
          <p className="entete__sur">La collection de Frank</p>
          <h1>Aujourd’hui</h1>
        </header>

        <section className="une" aria-labelledby="titre-une">
          <h2 id="titre-une" className="sr-only">
            À la une
          </h2>
          {A_LA_UNE.map(({ id, raison }) => {
            const app = application(id)!;
            return (
              <Link key={id} href={`/app/${app.id}/`} className="carte-une">
                <div className="carte-une__texte">
                  <p className="carte-une__sur">{app.subtitle}</p>
                  <h3>{app.title}</h3>
                  <p className="carte-une__raison">{raison}</p>
                </div>
                <div className="carte-une__apercus">
                  {captures(app)
                    .slice(0, 3)
                    .map((image) => (
                      <img
                        key={image}
                        src={ressource(image)}
                        alt=""
                        width={585}
                        height={1266}
                        loading="lazy"
                      />
                    ))}
                </div>
              </Link>
            );
          })}
        </section>

        <section className="bande" aria-labelledby="titre-tout">
          <div className="bande__tete">
            <h2 id="titre-tout">Toute la collection</h2>
            <Link href="/applications/">
              Voir <ChevronRight size={17} aria-hidden="true" />
            </Link>
          </div>
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
        </section>

        <aside className="mention" aria-label="À propos de cette collection">
          <p>
            Huit outils personnels, construits par Frank pour son travail. Ils
            ne remplacent ni les procédures officielles de votre employeur, ni
            un avis professionnel.
          </p>
          <p className="mention__meta">
            Aucune note, aucun avis, aucun compteur de téléchargement : rien de
            tout cela n’existe ici. Adresses vérifiées le {VERIFICATION_LIENS}.
          </p>
        </aside>
      </main>
    </StoreShell>
  );
}
