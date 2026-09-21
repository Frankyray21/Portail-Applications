import { APPLICATIONS } from '@/lib/catalogue';
import { StoreShell } from '../store-shell';
import { Recherche } from './recherche';

export const metadata = {
  title: 'Rechercher · Portail SST — MRI',
  description: 'Chercher une application dans la collection.',
};

export default function PageRecherche() {
  return (
    <StoreShell actif="recherche">
      <main id="contenu" className="page" tabIndex={-1}>
        <header className="entete">
          <h1>Rechercher</h1>
          <p className="entete__lede">
            Un nom, un thème ou un mot du contenu : la liste des{' '}
            {APPLICATIONS.length} applications se filtre pendant que vous
            tapez.
          </p>
        </header>
        <Recherche />
      </main>
    </StoreShell>
  );
}
