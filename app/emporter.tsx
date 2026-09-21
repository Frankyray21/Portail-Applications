import { Download, Globe, Smartphone, WifiOff } from 'lucide-react';
import { APK } from '@/lib/telechargement';
import { BoutonInstaller } from './installer';

// Emporter le portail sur l'appareil, par les deux chemins qui existent.
// La carte Android n'apparaît que si le fichier est vraiment publié :
// mieux vaut pas de bouton qu'un bouton qui renvoie une page introuvable.
export function Emporter() {
  return (
    <section className="emporter" aria-labelledby="titre-emporter">
      <h2 id="titre-emporter">Emporter le portail</h2>
      <p className="emporter__lede">
        <WifiOff size={17} aria-hidden="true" />
        Une fois installé, le portail s’ouvre depuis l’écran d’accueil et reste
        consultable sous terre, sans signal.
      </p>

      <ul className="emporter__liste">
        <li className="emporter__carte">
          <h3>
            <Globe size={20} aria-hidden="true" />
            Depuis le navigateur
          </h3>
          <p>
            Android, iPhone et ordinateur. Rien à télécharger, aucune
            permission à donner, et la mise à jour se fait toute seule.
          </p>
          <BoutonInstaller />
        </li>

        {APK.publie && (
          <li className="emporter__carte">
            <h3>
              <Smartphone size={20} aria-hidden="true" />
              Application Android
            </h3>
            <p>
              Tout le contenu est déjà dans le téléphone au moment de
              l’installation : pages, captures et codes QR compris.
            </p>
            <p className="emporter__bouton">
              <a href={APK.fichier} download>
                <Download size={18} aria-hidden="true" />
                Télécharger le fichier
              </a>
            </p>
            <p className="emporter__detail">
              Version {APK.version} · {APK.taille} · mis en ligne le{' '}
              {APK.date}
              <span className="emporter__note">
                À l’ouverture du fichier, Android demande d’autoriser
                l’installation depuis cette source. Une mise à jour
                s’installe par-dessus la précédente.
              </span>
            </p>
          </li>
        )}
      </ul>
    </section>
  );
}
