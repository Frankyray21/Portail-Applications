// Chemin public du site sur GitHub Pages. Une seule source de vérité :
// next.config.ts le lit, et ressource() préfixe les fichiers de public/.
// Ni les balises d images ni les URL écrites à la main ne le font seules,
// et sans le préfixe GitHub Pages répond 404.
export const BASE_PATH = '/Portail-Applications';

// Adresse publique du site. Elle sert aux codes QR : ce qu'on affiche au mur
// doit mener au vrai site, pas à un serveur de développement.
export const URL_PUBLIQUE =
  'https://frankyray21.github.io/Portail-Applications/';

export function ressource(chemin: string): string {
  return `${BASE_PATH}${chemin}`;
}
