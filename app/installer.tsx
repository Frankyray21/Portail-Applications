'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Check, Download, Share } from 'lucide-react';
import { ressource } from '@/lib/base';

interface InvitationInstallation extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Etat = 'installee' | 'ios' | 'autre';

const REQUETE_AUTONOME = '(display-mode: standalone)';

function lireEtat(): Etat {
  const autonome =
    window.matchMedia(REQUETE_AUTONOME).matches ||
    // Safari iOS n'expose pas display-mode : il a son propre indicateur.
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  if (autonome) return 'installee';
  const agent = navigator.userAgent;
  const iOS =
    /iphone|ipad|ipod/i.test(agent) &&
    /safari/i.test(agent) &&
    !/crios|fxios/i.test(agent);
  return iOS ? 'ios' : 'autre';
}

function sAbonner(prevenir: () => void) {
  const requete = window.matchMedia(REQUETE_AUTONOME);
  requete.addEventListener('change', prevenir);
  window.addEventListener('appinstalled', prevenir);
  return () => {
    requete.removeEventListener('change', prevenir);
    window.removeEventListener('appinstalled', prevenir);
  };
}

// Le service worker sert deux choses : rendre Le Hub installable, et garder
// les pages consultables sous terre, sans signal. Il ne met en cache que le
// portail : les applications gardent le leur, chacune sur son chemin.
// Ce composant ne dessine rien ; il est posé dans le pied de chaque page,
// pour que le cache se remplisse quelle que soit la page d'arrivée.
export function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .register(ressource('/sw.js'), { scope: ressource('/') })
      .catch(() => {
        // Une installation ratée ne doit jamais casser la navigation.
      });
  }, []);
  return null;
}

// Le geste d'installation depuis le navigateur. Trois situations, jamais un
// bouton qui ne ferait rien : le navigateur a donné l'invitation, ou c'est
// un iPhone et on décrit le geste, ou Le Hub est déjà installé.
export function BoutonInstaller() {
  // Rendu serveur : « installée », donc rien. Le client recalcule ensuite,
  // sans écart d'hydratation.
  const etat = useSyncExternalStore(sAbonner, lireEtat, () => 'installee');
  const [invitation, setInvitation] = useState<InvitationInstallation | null>(
    null,
  );

  useEffect(() => {
    const capter = (evenement: Event) => {
      evenement.preventDefault();
      setInvitation(evenement as InvitationInstallation);
    };
    const oublier = () => setInvitation(null);
    window.addEventListener('beforeinstallprompt', capter);
    window.addEventListener('appinstalled', oublier);
    return () => {
      window.removeEventListener('beforeinstallprompt', capter);
      window.removeEventListener('appinstalled', oublier);
    };
  }, []);

  const installer = useCallback(async () => {
    if (!invitation) return;
    await invitation.prompt();
    await invitation.userChoice;
    setInvitation(null);
  }, [invitation]);

  if (etat === 'installee') {
    return (
      <p className="installer installer--faite">
        <Check size={18} aria-hidden="true" />
        <span>Le Hub est installé sur cet appareil.</span>
      </p>
    );
  }

  if (invitation) {
    return (
      <p className="installer">
        <button type="button" onClick={installer}>
          <Download size={18} aria-hidden="true" />
          Installer Le Hub
        </button>
      </p>
    );
  }

  if (etat === 'ios') {
    return (
      <p className="installer installer--geste">
        <Share size={18} aria-hidden="true" />
        <span>
          Touchez <strong>Partager</strong>, puis{' '}
          <strong>Sur l’écran d’accueil</strong>.
        </span>
      </p>
    );
  }

  // Firefox et les navigateurs qui ne donnent pas l'invitation : le menu
  // reste le seul chemin, autant le nommer.
  return (
    <p className="installer installer--geste">
      <Download size={18} aria-hidden="true" />
      <span>
        Ouvrez le menu du navigateur, puis{' '}
        <strong>Installer l’application</strong> ou{' '}
        <strong>Ajouter à l’écran d’accueil</strong>.
      </span>
    </p>
  );
}
