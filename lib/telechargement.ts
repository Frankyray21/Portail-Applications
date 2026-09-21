// Les deux façons d'emporter le portail sur un appareil.
//
// 1. Depuis le navigateur (PWA) : marche partout, aucune permission à
//    donner, la mise à jour se fait toute seule.
// 2. Le fichier APK Android : la même chose, mais tout le contenu est déjà
//    dans le téléphone au moment de l'installation.
//
// L'APK est compilé et publié par .github/workflows/build-apk.yml sous un
// tag fixe : l'adresse de téléchargement ne change jamais, même quand la
// version monte.

const DEPOT = 'https://github.com/Frankyray21/Portail-Applications';
const TAG = 'apk-latest';

export interface Telechargement {
  /** Le fichier lui-même. */
  fichier: string;
  /** La page de la release, si quelqu'un préfère y passer. */
  page: string;
  /** Faux tant qu'aucune release n'existe : pas de bouton vers du vide. */
  publie: boolean;
  version: string;
  /** Déjà mise en forme, en mégaoctets. */
  taille: string;
  /** Date de publication, en toutes lettres. */
  date: string;
}

// Renseigné par `node scripts/relever-apk.mjs`, qui lit la release publiée.
// Jamais à la main : les quatre champs doivent décrire le même fichier.
export const APK: Telechargement = {
  fichier: `${DEPOT}/releases/download/${TAG}/portail-sst-mri.apk`,
  page: `${DEPOT}/releases/tag/${TAG}`,
  publie: false,
  version: '',
  taille: '',
  date: '',
};
