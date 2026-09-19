import {
  Accessibility,
  AudioLines,
  Box,
  ClipboardList,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import type { IconeId } from '@/lib/catalogue';

const ICONES = {
  tms: Accessibility,
  bruit: AudioLines,
  rodbot: Wrench,
  procedures: ClipboardList,
  wiki: ShieldCheck,
  anatomie: Box,
};

// Une plaque : un carré presque droit dans la couleur de l'application, et
// un pictogramme blanc au trait épais, lisible à 52 px comme à 88 px.
export function Icone({
  id,
  color,
  taille = 'normale',
}: {
  id: IconeId;
  color: string;
  taille?: 'normale' | 'grande';
}) {
  const Symbole = ICONES[id];
  return (
    <span
      className={`icone icone--${taille} color-${color}`}
      aria-hidden="true"
    >
      <Symbole strokeWidth={2} />
    </span>
  );
}
