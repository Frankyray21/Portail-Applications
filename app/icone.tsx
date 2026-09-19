import {
  Accessibility,
  AudioLines,
  Box,
  ClipboardList,
  Leaf,
  ShieldCheck,
  Tent,
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
  camping: Tent,
  glucides: Leaf,
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
  const Symbole = ICONES[id];
  return (
    <span
      className={`icone icone--${taille} color-${color}`}
      aria-hidden="true"
    >
      <Symbole strokeWidth={1.65} />
    </span>
  );
}
