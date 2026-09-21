'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Download, Share } from 'lucide-react';
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
function enregistrerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker
    .register(ressource('/sw.js'), { scope: ressource('/') })
    .catch(() => {
      // Une installation ratée ne doit jamais casser la navigation.
    });
}

export function Installer() {
  // Rendu serveur : « installée », donc rien. Le client recalcule ensuite,
  // sans écart d'hydratation.
  const etat = useSyncExternalStore(sAbonner, lireEtat, () => 'installee');
  const [invitation, setInvitation] = useState<InvitationInstallation | null>(
    null,
  );

  useEffect(() => {
    enregistrerServiceWorker();
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

  if (etat === 'installee') return null;

  // Aucun bouton qui ne ferait rien : on n'en montre un que si le navigateur
  // a vraiment donné l'invitation, et sur iOS on explique le geste.
  if (invitation) {
    return (
      <p className="installer">
        <button type="button" onClick={installer}>
          <Download size={17} aria-hidden="true" />
          Installer Le Hub
        </button>
        <span>Pour l’ouvrir depuis l’écran d’accueil, même sans signal.</span>
      </p>
    );
  }

  if (etat === 'ios') {
    return (
      <p className="installer installer--ios">
        <Share size={17} aria-hidden="true" />
        <span>
          Pour installer Le Hub : touchez <strong>Partager</strong>, puis{' '}
          <strong>Sur l’écran d’accueil</strong>.
        </span>
      </p>
    );
  }

  return null;
}
