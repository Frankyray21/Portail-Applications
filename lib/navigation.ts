export function sectionCourante(
  positions: readonly { id: string; top: number }[],
  finDePage = false,
): string {
  if (finDePage && positions.length) return positions[positions.length - 1].id;
  let active = 'accueil';
  for (const section of positions) {
    if (section.top <= 160) active = section.id;
  }
  return active;
}
