'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

// Le portail est sombre. Ce bouton ne fait qu'une chose : passer au clair
// pour qui lit mieux en noir sur blanc, et s'en souvenir sur l'appareil.
// Le réglage vit sur l'élément <html>, posé avant le premier affichage par
// le petit script de layout.tsx : aucun clignotement au chargement.
export const CLE = 'portail-sst-theme';

type Theme = 'sombre' | 'clair';

const ecouteurs = new Set<() => void>();

function sAbonner(prevenir: () => void) {
  ecouteurs.add(prevenir);
  // Un autre onglet a pu changer le réglage.
  window.addEventListener('storage', prevenir);
  return () => {
    ecouteurs.delete(prevenir);
    window.removeEventListener('storage', prevenir);
  };
}

const lire = (): Theme =>
  document.documentElement.dataset.theme === 'clair' ? 'clair' : 'sombre';

function poser(theme: Theme) {
  const racine = document.documentElement;
  if (theme === 'clair') racine.dataset.theme = 'clair';
  else delete racine.dataset.theme;
  // La barre du navigateur suit la coquille.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'clair' ? '#101214' : '#08090a');
  try {
    localStorage.setItem(CLE, theme);
  } catch {
    // Navigation privée ou stockage bloqué : le choix tient pour la visite.
  }
  for (const prevenir of ecouteurs) prevenir();
}

export function Theme() {
  // Rendu serveur : sombre, puisque c'est le thème par défaut.
  const theme = useSyncExternalStore(sAbonner, lire, () => 'sombre' as Theme);
  const basculer = useCallback(() => {
    poser(lire() === 'clair' ? 'sombre' : 'clair');
  }, []);

  return (
    <button
      type="button"
      className="theme"
      onClick={basculer}
      aria-pressed={theme === 'clair'}
    >
      {theme === 'clair' ? (
        <Moon size={20} aria-hidden="true" />
      ) : (
        <Sun size={20} aria-hidden="true" />
      )}
      <span className="sr-only">
        {theme === 'clair' ? 'Passer au thème sombre' : 'Passer au thème clair'}
      </span>
    </button>
  );
}
