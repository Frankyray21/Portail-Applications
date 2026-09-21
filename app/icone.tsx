import {
  Accessibility,
  AudioLines,
  ClipboardList,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { ressource } from '@/lib/base';
import { application, logo, type IconeId } from '@/lib/catalogue';

// Repli pour une application qui n'a pas encore de logo à elle.
const PLAQUES = {
  tms: Accessibility,
  bruit: AudioLines,
  rodbot: Wrench,
  procedures: ClipboardList,
  wiki: ShieldCheck,
};

export function Icone({
  id,
  color,
  taille = 'normale',
}: {
  id: IconeId;
  color: string;
  taille?: 'normale' | 'grande';
}) {
  const app = application(id);
  const image = app ? logo(app) : null;

  // Le logo de l'application, quand elle en a un : c'est à lui qu'on la
  // reconnaît sur son propre écran d'accueil. Décoratif ici, puisque le nom
  // est toujours écrit juste à côté.
  if (image) {
    return (
      <img
        className={`icone icone--${taille} icone--logo`}
        src={ressource(image)}
        alt=""
        width={256}
        height={256}
        loading="lazy"
      />
    );
  }

  const Symbole = PLAQUES[id];
  return (
    <span
      className={`icone icone--${taille} color-${color}`}
      aria-hidden="true"
    >
      <Symbole strokeWidth={2} />
    </span>
  );
}
