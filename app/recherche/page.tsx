import { APPLICATIONS } from '@/lib/catalogue';
import { StoreShell } from '../store-shell';
import { Recherche } from './recherche';

export const metadata = {
  title: 'Rechercher — Le Hub',
  description: 'Chercher une application dans la collection.',
};

export default function PageRecherche() {
  return (
    <StoreShell actif="recherche">
      <main id="contenu" className="page" tabIndex={-1}>
        <header className="entete">
          <p className="entete__sur">{APPLICATIONS.length} applications</p>
          <h1>Rechercher</h1>
        </header>
        <Recherche />
      </main>
    </StoreShell>
  );
}
