export function sectionCourante(
  positions: readonly { id: string; top: number }[],
  finDePage = false,
  ancre: string | null = null,
): string {
  // En fin de page, le défilement ne distingue plus les dernières sections :
  // sur un écran large, elles tiennent ensemble à l'image et aucune ne peut
  // atteindre le haut. On suit alors l'ancre demandée si elle commence à
  // l'écran, puis la première section visible, puis la dernière.
  if (finDePage && positions.length) {
    const visibles = positions.filter((section) => section.top >= 0);
    const demandee = visibles.find((section) => section.id === ancre);
    return (demandee ?? visibles[0] ?? positions[positions.length - 1]).id;
  }
  let active = 'accueil';
  for (const section of positions) {
    if (section.top <= 160) active = section.id;
  }
  return active;
}
